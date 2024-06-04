const pool = require('../config/db');

const getBooks = async () => {
  const query = 'SELECT * FROM books';
  const res = await pool.query(query);
  return res[0];
};

const getBookById = async (id) => {
  const query = 'SELECT * FROM books WHERE id = ?';
  const res = await pool.query(query, [id]);
  return res[0];
};

const addBook = async (title, author, isbn) => {
  const query = 'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)';
  await pool.query(query, [title, author, isbn]);
};

const updateBook = async (id, title, author, isbn) => {
  const query = 'UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?';
  await pool.query(query, [title, author, isbn, id]);
};

const deleteBook = async (id) => {
  const query = 'DELETE FROM books WHERE id = ?';
  await pool.query(query, [id]);
};

module.exports = { getBooks, getBookById, addBook, updateBook, deleteBook };
