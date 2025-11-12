/**
 * AI Assistance Disclosure:
 * Tool: GitHub Copilot (model: Claude Sonnet 4), date: 2025-10-28
 * Purpose: To update JWT verification to use JWK (JSON Web Key) public key format instead of shared secret.
 * Author Review: I validated correctness, security, and performance of the code.
 */

import jwt from "jsonwebtoken";
import { importJWK, exportSPKI } from "jose";
import { findUserById as _findUserById } from "../model/repository.js";

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
    const publicKeyObject = await importJWK(publicJwk, publicJwk.alg, { extractable: true });
    
    // Convert to PEM format that jsonwebtoken library expects
    const publicKeyPEM = await exportSPKI(publicKeyObject);
    
    // Verify the token using the public key in PEM format
    const decoded = jwt.verify(token, publicKeyPEM, { algorithms: [publicJwk.alg] });
    
    // load latest user info from DB
    const dbUser = await _findUserById(decoded.id);
    if (!dbUser) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    req.user = {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email,
      isAdmin: dbUser.isAdmin,
    };
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ message: "Authentication failed" });
  }
}

export function verifyIsAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Not authorized to access this resource" });
  }
}

export function verifyIsOwnerOrAdmin(req, res, next) {
  if (req.user.isAdmin) {
    return next();
  }

  const userIdFromReqParams = req.params.id;
  const userIdFromToken = req.user.id;
  if (userIdFromReqParams === userIdFromToken) {
    return next();
  }

  return res
    .status(403)
    .json({ message: "Not authorized to access this resource" });
}
