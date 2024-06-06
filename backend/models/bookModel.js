const pool = require('../config/db');

const getBooks = async () => {
  const query = 'SELECT * FROM books';
  const res = await pool.query(query);
  return res[0];
};

const getBookById = async (id) => {
  const query = 'SELECT * FROM books WHERE id = ?';
  const [rows] = await pool.query(query, [id]);
  return rows[0];
};

const addBook = async (title, author, isbn, total_copies) => {
  const query = 'INSERT INTO books (title, author, isbn, total_copies) VALUES (?, ?, ?, ?)';
  await pool.query(query, [title, author, isbn, total_copies]);
};

const updateBook = async (id, title, author, isbn, total_copies) => {
  const query = 'UPDATE books SET title = ?, author = ?, isbn = ?, total_copies = ? WHERE id = ?';
  await pool.query(query, [title, author, isbn, total_copies, id]);
};

const deleteBook = async (id) => {
  const query = 'DELETE FROM books WHERE id = ?';
  await pool.query(query, [id]);
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };
