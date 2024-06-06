const { getBooks } = require('../models/bookModel');
const { createTransaction, getTransactionsByUser, isBookCheckedOut, getActiveCheckoutTransaction, updateTransaction } = require('../models/transactionModel');
const asyncHandler = require("express-async-handler");
const pool = require("../config/db");
const viewBooks = async (req, res) => {
  const books = await getBooks();
  res.render('user-portal', { books });
};
const searchBooks = asyncHandler(async (req, res) => {
  const { search } = req.query; 

  const sqlQuery =
    "SELECT * FROM books WHERE LOWER(title) LIKE LOWER(?) OR LOWER(author) LIKE LOWER(?) AND total_copies >= 1";
  try {
    const [results] = await pool.query(sqlQuery, [`%${search}%`, `%${search}%`]);
    res.render("search", { books: results, success: null, error: null });
  } catch (err) {
    console.error("Error searching books:", err);
    res.render('search', { books: [], error: 'Error searching books', success: null });
  }
});

const requestCheckout = async (req, res) => {
  const { bookId } = req.body;

  try {
    const bookCheckedOut = await isBookCheckedOut(bookId);
    if (bookCheckedOut) {
      return res.render('user-portal', { books: await getBooks(), error: 'Book is already checked out' });
    }

    await createTransaction(req.user.userId, bookId, 'checkout');
    res.render('user-portal', { books: await getBooks(), success: 'Checkout request sent', error: null });
  } catch (error) {
    console.error('Error processing checkout request:', error);
    res.render('user-portal', { books: await getBooks(), error: 'Error processing checkout request', success: null });
  }
};

const requestCheckin = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;

  try {
    const activeCheckoutTransaction = await getActiveCheckoutTransaction(userId, bookId);
    if (activeCheckoutTransaction.length === 0) {
      await createTransaction(userId, bookId, 'checkin');
      res.render('user-portal', { books: await getBooks(), success: 'Check-in request sent', error: null });
    } else {
      await updateTransaction(activeCheckoutTransaction.id, { return_date: new Date(), fine: 0 });
      res.render('user-portal', { books: await getBooks(), success: 'Check-in request sent', error: null });
    }
  } catch (error) {
    console.error('Error processing check-in request:', error);
    res.render('user-portal', { books: await getBooks(), error: 'Error processing check-in request', success: null });
  }
};

const viewBorrowingHistory = async (req, res) => {
  const history = await getTransactionsByUser(req.user.userId);
  res.render('viewhistory', { history });
};

const requestAdminPrivilege = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(400).json({ success: false, error: "User information missing from request." });
  }

  const userId = req.user.userId;

  const [userRows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
  if (userRows.length === 0) {
    return res.status(404).json({ success: false, error: "User not found." });
  }
  const user = userRows[0];
  const [existingRequests] = await pool.execute("SELECT * FROM admin_requests WHERE user_id = ? AND status = 'pending'", [userId]);
  if (existingRequests.length > 0) {
    return res.render('user-portal', { books: await getBooks(), error: "You already have a pending request."});
  }

  await pool.execute("INSERT INTO admin_requests (user_id) VALUES (?)", [userId]);

  res.render('user-portal', { books: await getBooks(), success: "Admin request submitted successfully." });
});

module.exports = {
  viewBooks,
  searchBooks,
  requestCheckout,
  requestCheckin,
  viewBorrowingHistory,
  requestAdminPrivilege, 
};