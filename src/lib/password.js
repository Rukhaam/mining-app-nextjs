import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const HASH_ALGORITHM = "pbkdf2_sha512";
const HASH_DIGEST = "sha512";
const HASH_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 64;

export function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(
    password,
    salt,
    HASH_ITERATIONS,
    HASH_KEY_LENGTH,
    HASH_DIGEST,
  ).toString("base64url");

  return `${HASH_ALGORITHM}$${HASH_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password, storedHash) {
  if (!password || !storedHash) return false;

  const [algorithm, iterations, salt, hash] = storedHash.split("$");
  if (algorithm !== HASH_ALGORITHM || !iterations || !salt || !hash) {
    return false;
  }

  const calculatedHash = pbkdf2Sync(
    password,
    salt,
    Number(iterations),
    HASH_KEY_LENGTH,
    HASH_DIGEST,
  );
  const storedHashBuffer = Buffer.from(hash, "base64url");

  return (
    calculatedHash.length === storedHashBuffer.length &&
    timingSafeEqual(calculatedHash, storedHashBuffer)
  );
}
