const pool = require('../config/db');

const createTransaction = async (userId, bookId, transactionType) => {
  const query = 'INSERT INTO transactions (user_id, book_id, transaction_type) VALUES (?, ?, ?)';
  await pool.query(query, [userId, bookId, transactionType]);
};

const getTransactionsByUser = async (userId) => {
  const query = `
    SELECT t.*, b.title, b.author 
    FROM transactions t 
    JOIN books b ON t.book_id = b.id 
    WHERE t.user_id = ?
  `;
  const res = await pool.query(query, [userId]);
  return res[0];
};

const isBookCheckedOut = async (bookId) => {
  const query = `
    SELECT * FROM transactions 
    WHERE book_id = ? AND transaction_type = 'checkout' AND return_date IS NULL
  `;
  const res = await pool.query(query, [bookId]);
  return res[0].length > 0;
};

const updateTransaction = async (transactionId, returnDate, fine) => {
  const query = 'UPDATE transactions SET return_date = ?, fine = ? WHERE id = ?';
  await pool.query(query, [returnDate, fine, transactionId]);
};

const getActiveCheckoutTransaction = async (userId, bookId) => {
  const query = `
    SELECT * FROM transactions 
    WHERE user_id = ? AND book_id = ? AND transaction_type = 'checkout' AND return_date IS NULL
  `;
  const res = await pool.query(query, [userId, bookId]);
  return res[0];
};

module.exports = { createTransaction, getTransactionsByUser, isBookCheckedOut, updateTransaction, getActiveCheckoutTransaction };
