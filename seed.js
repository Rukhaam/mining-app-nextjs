const { pbkdf2Sync, randomBytes } = require("crypto");
const { config } = require("dotenv");
const postgres = require("postgres");

config({ path: ".env.local" });

const HASH_ALGORITHM = "pbkdf2_sha512";
const HASH_DIGEST = "sha512";
const HASH_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 64;

function hashPassword(password) {
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

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";

  if (!connectionString) {
    throw new Error("DATABASE_URL is required to seed the database.");
  }

  const sql = postgres(connectionString, { prepare: false });

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY,
        "username" varchar(100) NOT NULL UNIQUE,
        "password_hash" text NOT NULL,
        "role" varchar(50) NOT NULL DEFAULT 'admin',
        "created_at" timestamp DEFAULT now()
      )
    `;

    await sql`
      INSERT INTO "users" ("username", "password_hash", "role")
      VALUES (${username}, ${hashPassword(password)}, 'admin')
      ON CONFLICT ("username")
      DO UPDATE SET
        "password_hash" = EXCLUDED."password_hash",
        "role" = EXCLUDED."role"
    `;

    console.log(`Seeded admin user "${username}".`);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
