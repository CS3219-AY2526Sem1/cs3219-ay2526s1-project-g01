/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-09-15
 * Purpose: To implement simple cookie utilities for JWT token storage and removal, ensuring compatibility with Next.js middleware authentication.
 * Author Review: I validated correctness, security, and performance of the code.
 */

/**
 * AI Assistance Disclosure (additional):
 * Tool: ChatGPT (model: GPT-5 Thinking), date: 2025-10-08, timezone: Asia/Singapore (UTC+08:00)
 * Purpose: Ensure cookies set in the browser are reliably sent to Next.js middleware by fixing attributes (SameSite/Secure/Path/Domain) and providing helpers for full navigations so the next request carries the cookie.
 * Scope limits: Cookies are ONLY intended for Next.js middleware visibility, not for other backends. No server routes added.
 * Author Review: I validated correctness, security, and performance of the code. The original disclosure above remains untouched.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Cookie utilities for Next.js middleware visibility ONLY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true if this code is executing in a browser environment.
 */
function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Detect Cloud Run host. On *.run.app we must NOT set a custom Domain and
 * we generally need SameSite=None; Secure when traffic can be considered cross-site.
 */
function isCloudRunHost(hostname: string): boolean {
  return /\.run\.app$/i.test(hostname);
}

/**
 * Build cookie attribute list tailored for Next.js middleware to receive it.
 *
 * Default behavior:
 * - Path=/ so middleware on any route gets it.
 * - SameSite:
 *    • If on Cloud Run host or you explicitly force cross-site, use None (+ Secure on HTTPS).
 *    • Otherwise Lax (good default for same-site navigation).
 * - Domain:
 *    • Only set if a customDomain is provided and NOT on *.run.app.
 * - Secure:
 *    • Added automatically on HTTPS. Safe to include; ignored on http in some browsers.
 */
function computeCookieAttrs(opts?: {
  customDomain?: string | null;
  forceCrossSite?: boolean;
  maxAgeSeconds?: number | null; // if provided, sets Max-Age
}) {
  const attrs: string[] = ["Path=/"];

  const inBrowser = isBrowser();
  const protocol = inBrowser ? window.location.protocol : "https:";
  const host = inBrowser ? window.location.hostname : "";
  const isHttps = protocol === "https:";
  const cloudRun = isCloudRunHost(host);
  const crossSite = !!opts?.forceCrossSite || cloudRun;

  if (opts?.customDomain && !cloudRun) {
    attrs.push(`Domain=${opts.customDomain}`);
  }

  if (crossSite) {
    // Browsers require Secure when SameSite=None
    if (isHttps) attrs.push("Secure");
    attrs.push("SameSite=None");
  } else {
    attrs.push("SameSite=Lax");
    if (isHttps) attrs.push("Secure");
  }

  if (opts?.maxAgeSeconds && opts.maxAgeSeconds > 0) {
    attrs.push(`Max-Age=${opts.maxAgeSeconds}`);
  }

  return attrs;
}

/**
 * Join cookie name/value and attributes into a single header string.
 */
function buildCookieString(name: string, value: string, attrs: string[]) {
  return [`${name}=${value}`, ...attrs].join("; ");
}

/**
 * Set the "token" cookie in the browser so that the NEXT navigation request
 * will include it and be visible to Next.js middleware.
 *
 * IMPORTANT:
 *  - Because this is a client-set cookie (not HttpOnly), you should trigger a
 *    full navigation or at least a route transition after setting it so that
 *    the next request carries the Cookie header through middleware.
 */
export function addToken(
  token: string,
  options?: {
    customDomain?: string | null; // e.g. ".example.com" (omit on *.run.app)
    forceCrossSite?: boolean;     // true if your app flow is treated as cross-site
    maxAgeSeconds?: number;       // lifespan (default 7 days)
  }
): void {
  if (!isBrowser()) return;

  const attrs = computeCookieAttrs({
    customDomain: options?.customDomain ?? null,
    forceCrossSite: options?.forceCrossSite,
    maxAgeSeconds: options?.maxAgeSeconds ?? 60 * 60 * 24 * 7, // 7 days
  });

  // encodeURIComponent guards against special characters in JWTs
  document.cookie = buildCookieString("token", encodeURIComponent(token), attrs);
}

/**
 * Remove the "token" cookie by setting an expired cookie that matches the same
 * attributes that were used when setting it (Path/Domain/SameSite/Secure).
 */
export function removeToken(options?: {
  customDomain?: string | null;
  forceCrossSite?: boolean;
}): void {
  if (!isBrowser()) return;

  const attrs = computeCookieAttrs({
    customDomain: options?.customDomain ?? null,
    forceCrossSite: options?.forceCrossSite,
  });

  const deletion = [...attrs, "Expires=Thu, 01 Jan 1970 00:00:00 GMT", "Max-Age=0"];
  document.cookie = buildCookieString("token", "", deletion);
}

/**
 * Read the "token" cookie from document.cookie (client only).
 * Works in both development (HTTP) and production (HTTPS) when the cookie
 * is NOT HttpOnly. If you later switch to an HttpOnly, server-set cookie,
 * this will return null by design (the browser won’t expose it to JS).
 */
export function getToken(): string | null {
  if (typeof window === "undefined" || typeof document === "undefined") return null;
  const list = document.cookie ? document.cookie.split(";") : [];
  for (const raw of list) {
    const [k, ...rest] = raw.trim().split("=");
    if (k === "token") return rest.join("=") || "";
  }
  return null;
}

/**
 * Convenience helper: after setting the cookie, force a full navigation so the
 * browser sends the Cookie header on the next request and middleware can see it.
 *
 * If you prefer SPA navigation, ensure the route you hit still triggers a
 * request that passes through middleware (App Router typically will).
 */
export function navigateWithCookie(url: string): never {
  if (!isBrowser()) {
    throw new Error("navigateWithCookie must be called in a browser.");
  }
  // Full navigation ensures Cookie header is present for middleware.
  window.location.assign(url);
  // `never` return type; execution continues after navigation only on failure.
  throw new Error("Navigation did not occur.");
}

/**
 * Utility for debugging: returns the cookie names visible to the browser.
 * Use temporarily during development; remove in production.
 */
export function debugCookieNames(): string[] {
  if (!isBrowser()) return [];
  return document.cookie
    ? document.cookie.split(";").map(c => c.trim().split("=")[0])
    : [];
}
