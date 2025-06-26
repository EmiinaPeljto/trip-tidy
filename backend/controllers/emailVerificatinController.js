const emailVerificationsModel = require("../models/emailVerificationModel");
const userModel = require("../models/userModels");
const { sendVerificationEmail } = require("../utils/email");

exports.sendVerificationCode = async (req, res) => {
  const { email, first_name, last_name, username, password, phone_number } =
    req.body;

  const user = await userModel.getUserByEmail(email);
  if (user) return res.status(400).json({ message: "User already exists" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const bcrypt = require("bcrypt");
  const password_hash = await bcrypt.hash(password, 10);

  const payload = JSON.stringify({
    first_name,
    last_name,
    username,
    email,
    phone_number,
    password_hash,
  });

  await emailVerificationsModel.createEmailVerification(
    0, // user_id is 0 for new registrations
    email,
    code,
    expiresAt,
    payload
  );
  await sendVerificationEmail(email, first_name, code);

  res.json({ message: "Verification code sent." });
};

exports.verifyEmailCode = async (req, res) => {
  const { email, code } = req.body;
  const record = await emailVerificationsModel.verifyEmailCode(email, code);

  if (!record)
    return res.status(400).json({ message: "Invalid or expired code." });
  if (record.is_verified)
    return res.status(400).json({ message: "Already verified." });
  if (new Date(record.expires_at) < new Date())
    return res.status(400).json({ message: "Code expired." });

  let userData;
  if (typeof record.payload === "string") {
    userData = JSON.parse(record.payload);
  } else if (typeof record.payload === "object" && record.payload !== null) {
    userData = record.payload;
  } else {
    return res.status(400).json({ message: "Invalid registration data." });
  }

  // Check if user already exists (should not, but for safety)
  const existingUser = await userModel.getUserByEmail(userData.email);
  if (existingUser) {
    // Mark as verified, set user_id
    await emailVerificationsModel.updateEmailVerification(record.id, {
      is_verified: 1,
      user_id: existingUser.id,
    });
    return res
      .status(200)
      .json({ message: "Email already verified. User exists." });
  }

  // Create user in users table
  const result = await userModel.register({
    first_name: userData.first_name,
    last_name: userData.last_name,
    username: userData.username,
    email: userData.email,
    password_hash: userData.password_hash,
    google_id: null,
  });
  const userId = result.insertId;

  // Mark as verified and set user_id
  await emailVerificationsModel.updateEmailVerification(record.id, {
    is_verified: 1,
    user_id: userId,
  });

  res
    .status(200)
    .json({ message: "Email verified and registration complete." });
};

exports.resendVerificationCode = async (req, res) => {
  const { email } = req.body;
  // Find the latest unverified record
  const record = await emailVerificationsModel.getLatestEmailVerification(
    email
  );
  if (!record || record.is_verified) {
    return res.status(400).json({ message: "No pending registration found." });
  }

  let userData;
  if (typeof record.payload === "string") {
    userData = JSON.parse(record.payload);
  } else if (typeof record.payload === "object" && record.payload !== null) {
    userData = record.payload;
  } else {
    return res.status(400).json({ message: "Invalid registration data." });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await emailVerificationsModel.resendEmailVerification(
    record.user_id,
    email,
    code,
    expiresAt,
    record.payload
  );
  await sendVerificationEmail(email, userData.first_name, code);

  res.json({ message: "Verification code resent." });
};
