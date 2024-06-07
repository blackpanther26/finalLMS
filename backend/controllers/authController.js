const pool = require("../config/db");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const asyncHandler = require("express-async-handler");
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [allUsers] = await pool.execute("SELECT * FROM users");
    const isFirstUser = allUsers.length === 0;
    const isAdmin = isFirstUser ? 1 : 0;

    await pool.execute(
      "INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)",
      [username, hashedPassword, isAdmin]
    );

    const [newUser] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    const token = generateToken({
      userId: newUser[0].id,
      username: newUser[0].username,
      isAdmin: newUser[0].is_admin
    });

    return res.status(200).json({
      success: true,
      msg: "User registered successfully",
      user: newUser[0],
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
      return res.status(400).render('login', {
        error: 'Validation errors',
      });
    }

    const { username, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).render('login', {
        error: 'Username or password is incorrect',
      });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).render('login', {
        error: 'Username or password is incorrect',
      });
    }

    const token = generateToken({ userId: user.id, username: user.username, isAdmin: user.is_admin });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "Production",
      maxAge: 3600000,
    });

    if (user.is_admin == 1) {
      return res.redirect("/api/admin");
    } else {
      return res.redirect("/api/user-portal");
    }
  } catch (error) {
    return res.status(500).render('login', {
      error: 'Internal server error',
    });
  }
};

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt"); 
  res.redirect("/login"); 
});

module.exports = { registerUser, loginUser, currentUser, logoutUser };
