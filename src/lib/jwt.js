import { createHmac, timingSafeEqual } from "crypto";

const JWT_ALGORITHM = "HS256";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;

  if (secret) return secret;

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return "development-only-change-me";
}

function base64UrlEncode(value) {
  const input = typeof value === "string" ? value : JSON.stringify(value);

  return Buffer.from(input)
    .toString("base64url");
}

function base64UrlDecode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(unsignedToken) {
  return createHmac("sha256", getJwtSecret())
    .update(unsignedToken)
    .digest("base64url");
}

function signaturesMatch(expected, actual) {
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  );
}

export function signJwt(payload, expiresInSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: JWT_ALGORITHM, typ: "JWT" };
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };
  const unsignedToken = `${base64UrlEncode(header)}.${base64UrlEncode(body)}`;

  return `${unsignedToken}.${sign(unsignedToken)}`;
}

export function verifyJwt(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = sign(unsignedToken);

  if (!signaturesMatch(expectedSignature, signature)) return null;

  try {
    const header = JSON.parse(base64UrlDecode(encodedHeader));
    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    if (header.alg !== JWT_ALGORITHM || header.typ !== "JWT") return null;
    if (!payload.exp || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}
