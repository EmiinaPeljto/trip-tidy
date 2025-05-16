const axios = require("axios");
const dns = require("dns").promises;
const validation = require("validator");
const crypto = require("crypto");

async function validateUsernameUpdate(
  username,
  existingUsers,
  reservedUsernames
) {
  const errors = {};
  if (
    !username ||
    typeof username !== "string" ||
    username.trim() === "" ||
    !/^[a-zA-Z0-9]+$/.test(username)
  ) {
    errors.username = "Username is required and must be a string without special carracters.";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters long.";
  } else if (existingUsers.some((user) => user.username === username)) {
    errors.username = "Username is already taken.";
  } else if (
    reservedUsernames.some((user) => user.username === username.toLowerCase())
  ) {
    errors.username = "Username is reserved.";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

async function validateRegistrationData(
  { first_name, last_name, username, email, password_hash },
  existingUsers,
  reservedUsernames
) {
  const errors = {};

  // First name validation
  if (
    !first_name ||
    typeof first_name !== "string" ||
    first_name.trim() === ""
  ) {
    errors.first_name = "First name is required and must be a string.";
  } else if (first_name.length < 2) {
    errors.first_name = "First name must be at least 2 characters long.";
  }

  // Last name validation
  if (!last_name || typeof last_name !== "string" || last_name.trim() === "") {
    errors.last_name = "Last name is required and must be a string.";
  } else if (last_name.length < 2) {
    errors.last_name = "Last name must be at least 2 characters long.";
  }

  // Username validation
  const usernameValidation = validateUsernameUpdate(
    username,
    existingUsers,
    reservedUsernames
  );
  if (!usernameValidation.valid) {
    errors.username = usernameValidation.errors.username;
  }

  // Email validation
  if (!validation.isEmail(email)) {
    errors.email = "Invalid email format.";
  } else {
    const domain = email.split("@")[1];
    try {
      // Check TLD validity
      const tdl = await axios.get(
        "https://data.iana.org/TLD/tlds-alpha-by-domain.txt"
      );
      const tdlList = tdl.data
        .split("\n")
        .map((tld) => tld.trim().toLowerCase());
      const domainParts = domain.split(".");
      const domainTLD = domainParts[domainParts.length - 1].toLowerCase();

      if (!tdlList.includes(domainTLD)) {
        errors.email = "Email domain is not valid.";
      } else {
        // Check MX records
        const mxRecords = await dns.resolveMx(domain);
        if (mxRecords.length === 0) {
          errors.email = "Email domain does not have valid MX records.";
        }
      }
    } catch (error) {
      errors.email = "Error validating email domain.";
    }

    if (existingUsers.some((user) => user.email === email)) {
      errors.email = "Email is already registered.";
    }
  }

  // Validate password
  if (!password_hash || password_hash.length < 8) {
    errors.password_hash =
      "Password is required and must be at least 8 characters long.";
  } else {
    try {
      const sha1Hash = crypto
        .createHash("sha1")
        .update(password_hash)
        .digest("hex");
      const response = await axios.get(
        "https://api.pwnedpasswords.com/range/" + sha1Hash.slice(0, 5)
      );
      const hashes = response.data.split("\n");
      const hashSuffix = sha1Hash.slice(5).toUpperCase();
      const found = hashes.some((line) => line.startsWith(hashSuffix));
      if (found) {
        errors.password_hash =
          "Password has been compromised in a data breach. Please choose a different password.";
      }
    } catch (error) {
      console.error("Error checking password:", error);
      errors.password_hash = "Error checking password. Please try again later.";
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  validateRegistrationData,
  validateUsernameUpdate,
};
