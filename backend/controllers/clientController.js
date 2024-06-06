const { getBooks, getBookById } = require('../models/bookModel');
const { createTransaction, getTransactionsByUser, isBookCheckedOut, getActiveCheckoutTransaction, updateTransaction } = require('../models/transactionModel');
const asyncHandler = require("express-async-handler");
const pool = require("../config/db");
const viewBooks = async (req, res) => {
  const books = await getBooks();

  res.render('user-portal', { books });
  //res.json(books);
};

const requestCheckout = async (req, res) => {
  const { bookId } = req.body;

  // Check if the book is already checked out
  const bookCheckedOut = await isBookCheckedOut(bookId);
  if (bookCheckedOut) {
    return res.status(400).send('Book is already checked out');
  }

  await createTransaction(req.user.userId, bookId, 'checkout');
  res.send('Checkout request sent');
};

const requestCheckin = async (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.userId;

  // Check if there is an active checkout transaction for this book by this user
  const activeCheckoutTransaction = await getActiveCheckoutTransaction(userId, bookId);
  //console.log(activeCheckoutTransaction);
  if (activeCheckoutTransaction.length === 0) {
    // If there's no active checkout transaction, treat it as a check-in request
    try {
      //console.log("first")
      await createTransaction(userId, bookId, 'checkin');
      res.send('Check-in request sent');
    } catch (error) {
     //console.log(error);
      res.status(500).send('Error sending check-in request');
    }
    return;
  }

  // Update the active checkout transaction to mark the return date
  await updateTransaction(activeCheckoutTransaction.id, { return_date: new Date(), fine: 0 });
  //console.log(activeCheckoutTransaction.id);
  res.send('Check-in request sent');
};

const viewBorrowingHistory = async (req, res) => {
  const history = await getTransactionsByUser(req.user.userId);
  res.render('viewhistory', { history });
};

const requestAdminPrivilege = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.userId) {
    return res.status(400).json({ success: false, msg: "User information missing from request." });
  }

  const userId = req.user.userId;

  const [userRows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId]);
  if (userRows.length === 0) {
    return res.status(404).json({ success: false, msg: "User not found." });
  }

  const user = userRows[0];

  // Check if a pending request already exists
  const [existingRequests] = await pool.execute("SELECT * FROM admin_requests WHERE user_id = ? AND status = 'pending'", [userId]);
  if (existingRequests.length > 0) {
    return res.render('admin-request', { message: { success: false, msg: "You already have a pending request." }});
  }

  // Insert a new admin request
  await pool.execute("INSERT INTO admin_requests (user_id) VALUES (?)", [userId]);

  res.render('admin-request', { message: { success: true, msg: "Admin request submitted successfully." }});
});

module.exports = {
  viewBooks,
  requestCheckout,
  requestCheckin,
  viewBorrowingHistory,
  requestAdminPrivilege, 
};