const userModel = require("../models/userModels");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/email");
const jwt = require("jsonwebtoken");

const {
  validateRegistrationData,
  validateUsernameUpdate,
} = require("../contracts/registrationValidation");
const emailVerificationsModel = require("../models/emailVerificationModel");
const { sendVerificationEmail } = require("../utils/email");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      username,
      email,
      password_hash,
      phone_number,
    } = req.body;

    // Validate input as before (reuse your validation logic)
    const existingUsersRaw = await userModel.getAllUsers();
    const reservedUsernamesRaw = await userModel.getReservedUsernames();
    const reservedUsernames = reservedUsernamesRaw.map((user) => user.username);

    // You may want to adjust this to your actual validation function
    const { valid, errors } = await validateRegistrationData(
      { first_name, last_name, username, email, password_hash, phone_number },
      existingUsersRaw,
      reservedUsernames
    );
    if (!valid) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // Hash password for storage
    const hashedPassword = await bcrypt.hash(password_hash, 10);

    // Prepare payload for email_verifications
    const payload = JSON.stringify({
      first_name,
      last_name,
      username,
      email,
      phone_number,
      password_hash: hashedPassword,
    });

    // Generate code and expiration
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Store in email_verifications (no userId yet)
    await emailVerificationsModel.createEmailVerification(
      null, // userId is null for now
      email,
      code,
      expiresAt,
      payload
    );

    // Send verification email
    await sendVerificationEmail(email, first_name, code);

    res.status(201).json({
      message:
        "Verification code sent to your email. Please verify to complete registration.",
      email,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password_hash } = req.body;
    const user = await userModel.login({ email, username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password_hash,
      user.password_hash
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials. Please try again." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "168h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const existingUsers = await userModel.getAllUsers();
    const reservedUsernames = await userModel.getReservedUsernames();

    const { valid, errors } = await validateUsernameUpdate(
      username,
      existingUsers,
      reservedUsernames
    );

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const result = await userModel.updateUser(id, username);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    return res
      .status(200)
      .json({ message: "If this email exists, a reset link has been sent." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  await userModel.createPasswordResetToken(email, token, expiresAt);
  await sendPasswordResetEmail(email, user.first_name, token);
  res
    .status(200)
    .json({ message: "If this email exists, a reset link has been sent." });
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  const reset = await userModel.getPasswordResetByToken(token);
  if (!reset) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.updateUserPassword(reset.email, hashedPassword);
  await userModel.deletePasswordResetToken(token);
  res
    .status(200)
    .json({ message: "Password has been reset. You can now log in." });
};

exports.getMe = async (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    const user = await userModel.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};
