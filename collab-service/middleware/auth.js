/**
 * The following code is retrieved from matching-service/middleware/auth.js
 *
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-10-29
 * Purpose: To implement JWT verification middleware for matching-service using JWK public key.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import jwt from "jsonwebtoken";
import { importJWK, exportSPKI } from "jose";

export async function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    // request auth header: `Authorization: Bearer + <access_token>`
    const token = authHeader.split(" ")[1];

    // Parse the PUBLIC_JWK from environment variable
    const publicJwk = JSON.parse(process.env.PUBLIC_JWK);

    // Import the JWK as a public key object with extractable flag
    const publicKeyObject = await importJWK(publicJwk, publicJwk.alg, {
      extractable: true,
    });

    // Convert to PEM format that jsonwebtoken library expects
    const publicKeyPEM = await exportSPKI(publicKeyObject);

    // Verify the token using the public key in PEM format
    const decoded = jwt.verify(token, publicKeyPEM, {
      algorithms: [publicJwk.alg],
    });

    // Add user info to request
    req.user = {
      id: decoded.id,
    };
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Authentication failed" });
  }
}
