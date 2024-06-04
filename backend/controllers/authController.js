const pool = require("../config/db");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt"); // Importing the generateToken function

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { username, password } = req.body;

    // Check if username exists
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        msg: "Username already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.execute(
      "INSERT INTO users (username, password_hash) VALUES (?, ?)",
      [username, hashedPassword]
    );

    // Fetch the newly registered user data
    const [newUser] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // Generate JWT token
    const token = generateToken({ userId: newUser[0].id, username: newUser[0].username });

    // Return the user data along with success message and token
    return res.status(200).json({
      success: true,
      msg: "User registered successfully",
      user: newUser[0], // Assuming there's only one user with this username
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        msg: "Validation errors",
        errors: errors.array(),
      });
    }

    const { username, password } = req.body;

    // Check if the username exists
    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        msg: "Username or password is incorrect",
      });
    }

    // Compare passwords
    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        msg: "Username or password is incorrect",
      });
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, username: user.username });

    return res.status(200).json({
      success: true,
      msg: "Login successful",
      token: token,
      tokenType:'Bearer',
      user: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: error.message,
    });
  }
};

module.exports = { registerUser, loginUser };
