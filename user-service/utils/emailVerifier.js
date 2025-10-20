/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: ChatGPT 5 thinking), date: 2025-10-21
 * Purpose: To create email utility functions for verifying email existence using DNS MX lookup and SMTP RCPT TO probing.
 * Author Review: I validated correctness, security, and performance of the code. I also redued the retry timer for more responsiveness
 *
 * Tool: GitHub Copilot(Grok Code Fast), date: 2025-10-21
 * Purpose: To add error handling for DNS resolution failures in verifyEmailExists function to prevent service crashes.
 * Author Review: Added try-catch block around resolveMx() call to handle ENOTFOUND errors gracefully and return proper unknown status instead of throwing unhandled exceptions.
 */

// emailVerifier.js (ESM)
// Purpose: Verify whether a mailbox likely exists using DNS MX lookup + SMTP RCPT TO probe.
// Returns one of: { status: 'valid' | 'invalid' | 'unknown', reason, mxTried, transcript }

import { resolveMx } from 'dns/promises';
import net from 'net';
import tls from 'tls';
import ms from 'ms';

/**
 * Read a single SMTP response line (handles multi-line banners by returning the last code).
 * We collect the raw transcript for debugging/auditing.
 * @param {net.Socket|tls.TLSSocket} socket - The SMTP socket connection
 * @param {Array} transcript - Array to collect transcript lines for debugging
 * @returns {Promise<{code: number, text: string}>} Promise resolving to an object containing:
 *   - code: The 3-digit SMTP response code (e.g., 250 for success)
 *   - text: The response message text after the code
 */
function readSmtpResponse(socket, transcript) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const onData = (chunk) => {
      buffer += chunk.toString('utf8');

      // SMTP lines end with \r\n. A full response may be multi-line:
      // 250-... \r\n
      // 250-... \r\n
      // 250 ...  \r\n (last line: space after code)
      // We resolve once we see a line that starts with 3 digits + space.
      const lines = buffer.split('\r\n');
      // Keep all complete lines except possibly the last partial one
      const complete = lines.slice(0, -1);

      // Append to transcript
      for (const line of complete) {
        if (line.length) transcript.push({ dir: '<', line });
      }

      // If the last complete line is final (e.g., 250 SP), we resolve with its code and text
      const finalLine = [...complete].reverse().find(l => /^\d{3} /.test(l));
      if (finalLine) {
        socket.off('data', onData);
        const code = parseInt(finalLine.slice(0, 3), 10);
        const text = finalLine.slice(4);
        resolve({ code, text });
      }
      // else: keep accumulating until we see a final line
    };

    const onError = (err) => {
      socket.off('data', onData);
      reject(err);
    };
    const onClose = () => {
      socket.off('data', onData);
      reject(new Error('SMTP connection closed before response'));
    };

    socket.on('data', onData);
    socket.once('error', onError);
    socket.once('close', onClose);
  });
}

/**
 * Send a single SMTP command and return the response.
 * @param {net.Socket|tls.TLSSocket} socket - The SMTP socket connection
 * @param {Array} transcript - Array to collect transcript lines for debugging
 * @param {string} cmd - The SMTP command to send
 * @returns {Promise<{code: number, text: string}>} Promise resolving to an object containing:
 *   - code: The 3-digit SMTP response code (e.g., 250 for success)
 *   - text: The response message text after the code
 */
async function smtpCmd(socket, transcript, cmd) {
  transcript.push({ dir: '>', line: cmd.trimEnd() });
  socket.write(cmd);
  return readSmtpResponse(socket, transcript);
}

/**
 * Attempt SMTP RCPT verification against one MX host.
 * Optionally upgrades to STARTTLS if advertised.
 * @param {Object} params - Parameters for the MX attempt
 * @param {string} params.host - MX host to connect to
 * @param {string} params.email - Email address to verify
 * @param {string} params.heloDomain - Domain to use in HELO/EHLO command
 * @param {number} params.timeoutMs - Connection timeout in milliseconds
 * @param {boolean} params.useStartTLS - Whether to attempt STARTTLS upgrade
 * @param {string} params.mailFrom - Email address to use in MAIL FROM command
 * @param {Array} transcript - Array to collect transcript lines for debugging
 * @returns {Promise<{status: 'valid'|'invalid'|'unknown', reason: string}>} Promise resolving to an object containing:
 *   - status: 'valid' (email likely exists), 'invalid' (email definitely doesn't exist), or 'unknown' (couldn't determine)
 *   - reason: Detailed explanation of the verification result including SMTP response codes
 */
async function tryMx({ host, email, heloDomain, timeoutMs, useStartTLS, mailFrom }, transcript) {
  // Plain TCP first (STARTTLS upgrade later if offered)
  let socket = net.createConnection({ host, port: 25 });
  // Enforce a hard timeout for the whole attempt
  socket.setTimeout(timeoutMs, () => socket.destroy(new Error('Timeout')));

  // 220 banner
  let res = await readSmtpResponse(socket, transcript);
  if (res.code !== 220) throw new Error(`Unexpected banner from ${host}: ${res.code} ${res.text}`);

  // EHLO
  res = await smtpCmd(socket, transcript, `EHLO ${heloDomain}\r\n`);
  if (String(res.code)[0] !== '2') {
    // Fall back to HELO if EHLO denied
    res = await smtpCmd(socket, transcript, `HELO ${heloDomain}\r\n`);
    if (String(res.code)[0] !== '2') throw new Error(`HELO/EHLO rejected: ${res.code} ${res.text}`);
  }

  // STARTTLS if requested
  if (useStartTLS) {
    // Check if EHLO response contained STARTTLS; transcript already has the lines.
    const ehloLines = transcript
      .filter(x => x.dir === '<')
      .map(x => x.line.toUpperCase());
    const supportsStartTLS = ehloLines.some(l => l.includes('STARTTLS'));

    if (supportsStartTLS) {
      res = await smtpCmd(socket, transcript, 'STARTTLS\r\n');
      if (String(res.code)[0] !== '2') {
        throw new Error(`STARTTLS refused by ${host}: ${res.code} ${res.text}`);
      }
      // Upgrade the socket
      socket = await new Promise((resolve, reject) => {
        const secure = tls.connect(
          { socket, servername: host, rejectUnauthorized: false }, // NOTE: many MX hosts use diverse certs; disable strict verify or pin if you can.
          () => resolve(secure)
        );
        secure.once('error', reject);
      });

      // Re-issue EHLO after STARTTLS as required by RFC
      res = await smtpCmd(socket, transcript, `EHLO ${heloDomain}\r\n`);
      if (String(res.code)[0] !== '2') {
        throw new Error(`EHLO after STARTTLS rejected: ${res.code} ${res.text}`);
      }
    }
  }

  // MAIL FROM: use an empty reverse-path or a known-good mailbox/domain you control.
  res = await smtpCmd(socket, transcript, `MAIL FROM:<${mailFrom}>\r\n`);
  if (String(res.code)[0] !== '2' && String(res.code)[0] !== '3') {
    // Some servers reply 250 OK, others 250 2.1.0, etc.
    throw new Error(`MAIL FROM rejected: ${res.code} ${res.text}`);
  }

  // RCPT TO: the crucial check
  res = await smtpCmd(socket, transcript, `RCPT TO:<${email}>\r\n`);

  // Politely quit (don’t proceed to DATA)
  try { await smtpCmd(socket, transcript, 'RSET\r\n'); } catch {}
  try { await smtpCmd(socket, transcript, 'QUIT\r\n'); } catch {}
  socket.destroy();

  const c = res.code;
  if (c === 250 || c === 251) {
    // Accepted (could still be catch-all)
    return { status: 'valid', reason: `${c} ${res.text}` };
  }
  if (c === 550 || c === 551 || c === 553 || c === 552 || c === 554) {
    return { status: 'invalid', reason: `${c} ${res.text}` };
  }
  if (c === 450 || c === 451 || c === 452) {
    return { status: 'unknown', reason: `Temporary failure: ${c} ${res.text}` };
  }
  return { status: 'unknown', reason: `Ambiguous RCPT response: ${c} ${res.text}` };
}

/**
 * Main entry: verifyEmailExists(email, options?)
 * @param {string} email - The email address to verify
 * @param {Object} [options={}] - Optional configuration options
 * @param {string|number} [options.timeout='1s'] - Timeout for SMTP operations (human-friendly string or milliseconds)
 * @param {string} [options.heloDomain='example.com'] - Domain to use in HELO/EHLO command
 * @param {boolean} [options.useStartTLS=true] - Whether to attempt STARTTLS upgrade
 * @param {string} [options.mailFrom=''] - Email address to use in MAIL FROM command
 * @param {number} [options.maxMxTries=3] - Maximum number of MX hosts to try
 * @returns {Promise<{status: 'valid'|'invalid'|'unknown', reason: string, mxTried: string[], transcript: Array}>} Promise resolving to an object containing:
 *   - status: 'valid' (email likely exists), 'invalid' (email definitely doesn't exist), or 'unknown' (couldn't determine)
 *   - reason: Detailed explanation of the verification result
 *   - mxTried: Array of MX hostnames that were attempted for verification
 *   - transcript: Array of SMTP command/response lines for debugging and auditing
 */
export async function verifyEmailExists(email, options = {}) {
  const {
    timeout = '1s',              // human-friendly (ms package)
    heloDomain = 'example.com',   // your sending domain or server hostname
    useStartTLS = true,           // try STARTTLS if offered
    mailFrom = '',                // empty reverse-path is RFC-valid; better: no-reply@yourdomain
    maxMxTries = 3,               // try up to N MX hosts in priority order
  } = options;

  const timeoutMs = typeof timeout === 'string' ? ms(timeout) : timeout;

  // Split local@domain
  const at = email.lastIndexOf('@');
  if (at === -1) throw new Error('Email must contain "@"');
  const domain = email.slice(at + 1);

  // 1) MX lookup
  let mxRecords;
  try {
    mxRecords = await resolveMx(domain);
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return {
        status: 'unknown',
        reason: `Domain "${domain}" not found or has no DNS records.`,
        mxTried: [],
        transcript: [{ dir: '!', line: `DNS lookup failed: ${err.message}` }],
      };
    }
    // Re-throw other DNS errors (like timeouts, etc.)
    throw err;
  }

  if (!mxRecords || mxRecords.length === 0) {
    return {
      status: 'unknown',
      reason: `No MX records for domain "${domain}". Some domains receive mail on A-records only.`,
      mxTried: [],
      transcript: [],
    };
  }

  // Sort by priority (lowest first)
  mxRecords.sort((a, b) => a.priority - b.priority);

  // 2) Try MX servers in order
  const transcripts = [];
  for (const [i, mx] of mxRecords.entries()) {
    if (i >= maxMxTries) break;

    const transcript = [];
    try {
      const result = await tryMx(
        {
          host: mx.exchange,
          email,
          heloDomain,
          timeoutMs,
          useStartTLS,
          mailFrom,
        },
        transcript
      );
      return { ...result, mxTried: [mx.exchange], transcript };
    } catch (err) {
      transcript.push({ dir: '!', line: `Error on ${mx.exchange}: ${err.message}` });
      transcripts.push({ mx: mx.exchange, transcript });
      // Try next MX
    }
  }

  // If all MX attempts failed to produce a definitive answer:
  return {
    status: 'unknown',
    reason: 'All MX attempts failed or were inconclusive.',
    mxTried: transcripts.map(t => t.mx),
    transcript: transcripts.flatMap(t => [{ dir: '!', line: `--- ${t.mx} ---` }, ...t.transcript]),
  };
}
