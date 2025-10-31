/**
 * AI Assistance Disclosure:
 * Tool: ChatGPT (model: ChatGPT 5 thinking), date: 2025-10-28
 * Purpose: To create a utility script for generating public/private key pairs in JWK format for JWT signing and verification.
 * Author Review: I validated correctness, security, and performance of the code.
 */


import { generateKeyPair, exportJWK } from 'jose';

// Pick one: 'RS256' | 'ES256' | 'EdDSA'
const alg = 'RS256';

// For RS256 it's good to set modulusLength=2048 or 3072
const { publicKey, privateKey } = await generateKeyPair(alg, {
  extractable: true,
  ...(alg === 'RS256' ? { modulusLength: 2048 } : {})
});

const kid = globalThis.crypto.randomUUID();

const pubJwk  = Object.assign(await exportJWK(publicKey),  { kid, alg, use: 'sig' });
const privJwk = Object.assign(await exportJWK(privateKey), { kid, alg, use: 'sig' });

console.log('PUBLIC_JWK=',  JSON.stringify(pubJwk));
console.log('PRIVATE_JWK=', JSON.stringify(privJwk));
