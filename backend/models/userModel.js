const pool = require('../config/db');

const createUser = async (username, passwordHash, isAdmin = false) => {
  const query = 'INSERT INTO users (username, password_hash, is_admin) VALUES ($1, $2, $3)';
  await pool.query(query, [username, passwordHash, isAdmin]);
};

const getUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = $1';
  const res = await pool.query(query, [username]);
  return res.rows[0];
};

const updateUserRole = async (username, isAdmin) => {
  const query = 'UPDATE users SET is_admin = $1 WHERE username = $2';
  await pool.query(query, [isAdmin, username]);
};

module.exports = { createUser, getUserByUsername, updateUserRole };
