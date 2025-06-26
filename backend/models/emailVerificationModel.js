const db = require("../config/db");
const crypto = require("crypto");

exports.createEmailVerification = async (
  userId,
  email,
  code,
  expiresAt,
  payload
) => {
  const tokenHash = require("crypto")
    .createHash("sha256")
    .update(String(code))
    .digest("hex");
  await db.query(
    `INSERT INTO email_verifications (user_id, email, token_hash, payload, is_verified, expires_at) VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, email, tokenHash, payload, 0, expiresAt]
  );
};

exports.resendEmailVerification = async (
  user_id,
  email,
  code,
  expiresAt,
  payload
) => {
  const tokenHash = require("crypto")
    .createHash("sha256")
    .update(String(code))
    .digest("hex");

  // Ensure payload is in the correct format
  const formattedPayload =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  await db.query(
    `INSERT INTO email_verifications (user_id, email, token_hash, payload, is_verified, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP())`,
    [user_id, email, tokenHash, formattedPayload, 0, expiresAt]
  );
};

exports.verifyEmailCode = async (email, code) => {
  const tokenHash = crypto
    .createHash("sha256")
    .update(String(code))
    .digest("hex");
  const [rows] = await db.query(
    `SELECT * FROM email_verifications WHERE email = ? AND token_hash = ? ORDER BY created_at DESC LIMIT 1`,
    [email, tokenHash]
  );
  return rows[0];
};

exports.updateEmailVerification = async (id, fields) => {
  const sets = [];
  const values = [];
  for (const key in fields) {
    sets.push(`${key} = ?`);
    values.push(fields[key]);
  }
  values.push(id);
  await db.query(
    `UPDATE email_verifications SET ${sets.join(", ")} WHERE id = ?`,
    values
  );
};

exports.getLatestEmailVerification = async (email) => {
  const [rows] = await db.query(
    `SELECT * FROM email_verifications WHERE email = ? AND is_verified = 0 ORDER BY created_at DESC LIMIT 1`,
    [email]
  );
  return rows[0];
};
