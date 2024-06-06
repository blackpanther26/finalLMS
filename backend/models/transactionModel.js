const pool = require('../config/db');

const createTransaction = async (userId, bookId, transactionType) => {
  const query = 'INSERT INTO transactions (user_id, book_id, transaction_type, return_date, fine) VALUES (?, ?, ?, NULL, 0)';
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

const updateTransaction = async (transactionId, updates) => {
  if (Object.keys(updates).length === 0) {
    throw new Error('No updates provided');
  }

  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
  const values = Object.values(updates);
  values.push(transactionId);
  const query = `UPDATE transactions SET ${setClause} WHERE id = ?`;
  await pool.query(query, values);
};

const getActiveCheckoutTransaction = async (userId, bookId) => {
  const query = `
    SELECT * FROM transactions 
    WHERE user_id = ? AND book_id = ? AND transaction_type = 'checkout' AND return_date IS NULL AND status = 'approved'
  `;
  const res = await pool.query(query, [userId, bookId]);
  return res[0];
};

const getTransactions = async () => {
  //console.log("getTransactions");
  const query = `
    SELECT * FROM transactions;
  `;
  try {
    const res = await pool.query(query);
    // console.log(res); // Logging the entire result to understand its structure
    // Adjusting to access the first element of the outer array, which contains the transaction records
    return res[0]; // This should now correctly return the array of transaction objects
  } catch (error) {
    console.error('Error executing query:', error);
    throw error; // Rethrow the error to propagate it up the call stack
  }
};


const getTransactionById = async (transactionId) => {
  const query = `
    SELECT t.*, b.title, b.author 
    FROM transactions t 
    JOIN users u ON t.user_id = u.id 
    JOIN books b ON t.book_id = b.id 
    WHERE t.id = ?
  `;
  const res = await pool.query(query, [transactionId]);
  return res[0][0];
};

module.exports = {
  createTransaction,
  getTransactionsByUser,
  isBookCheckedOut,
  updateTransaction,
  getActiveCheckoutTransaction,
  getTransactions,
  getTransactionById
};
