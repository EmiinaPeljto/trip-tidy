const userModel = require("../models/userModels");
const {
  validateRegistrationData,
  validateUsernameUpdate,
} = require("../contracts/registrationValidation");
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
    const { first_name, last_name, username, email, password_hash } = req.body;
    const existingUsers = await userModel.getAllUsers();
    const reservedUsernames = await userModel.getReservedUsernames();

    const { valid, errors } = await validateRegistrationData(
      { first_name, last_name, username, email, password_hash },
      existingUsers,
      reservedUsernames
    );

    if (!valid) {
      return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    const newUser = {
      first_name,
      last_name,
      username,
      email,
      password_hash: hashedPassword,
      google_id: null
    };

    

    const result = await userModel.register(newUser);
    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password_hash } = req.body;
    const user = await userModel.login({ email, username});

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password_hash, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials. Please try again." });
    }

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.getUserById = async (req, res) => {
  try{
    const {id} = req.params;
    const user = await userModel.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const existingUsers = await userModel.getAllUsers();
    const reservedUsernames = await userModel.getReservedUsernames();

    const { valid, errors } = await validateUsernameUpdate(
      username ,
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
}