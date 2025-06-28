const db = require("../config/db");
const crypto = require("crypto");

exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

exports.getReservedUsernames = async () => {
  const [rows] = await db.query("SELECT username FROM reserved_usernames");
  return rows;
};

exports.getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0];
};

exports.register = async ({
  first_name,
  last_name,
  username,
  email,
  password_hash,
  google_id,
}) => {
  const [rows] = await db.query(
    "INSERT INTO users (first_name, last_name, username, email, password_hash, google_id) VALUES (?, ?, ?, ?, ?, ?)",
    [first_name, last_name, username, email, password_hash, google_id]
  );
  return rows;
};

exports.login = async ({ email, username }) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ? OR username = ?",
    [email, username]
  );
  return rows[0];
};

exports.updateUser = async (id, username) => {
  const [rows] = await db.query("UPDATE users SET username = ? WHERE id = ?", [
    username,
    id,
  ]);
  return rows;
};

exports.getUserByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
};

exports.createPasswordResetToken = async (email, token, expiresAt) => {
  await db.query(
    "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
    [email, token, expiresAt]
  );
};

exports.getPasswordResetByToken = async (token) => {
  const [rows] = await db.query(
    "SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()",
    [token]
  );
  return rows[0];
};

exports.deletePasswordResetToken = async (token) => {
  await db.query("DELETE FROM password_resets WHERE token = ?", [token]);
};

exports.updateUserPassword = async (email, password_hash) => {
  await db.query("UPDATE users SET password_hash = ? WHERE email = ?", [
    password_hash,
    email,
  ]);
};
