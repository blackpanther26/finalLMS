const { getBooks, getBookById } = require('../models/bookModel');
const { createTransaction, getTransactionsByUser, isBookCheckedOut, getActiveCheckoutTransaction, updateTransaction } = require('../models/transactionModel');

const viewBooks = async (req, res) => {
  const books = await getBooks();
  res.json(books);
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
  
  // Check if there is an active checkout transaction for this book by this user
  const activeTransaction = await getActiveCheckoutTransaction(req.user.userId, bookId);
  if (!activeTransaction) {
    return res.status(400).send('No active checkout transaction found for this book');
  }

  // Update the transaction to mark the return date
  await updateTransaction(activeTransaction.id, new Date(), 0); // Assuming no fine for simplicity
  res.send('Checkin request sent');
};

const viewBorrowingHistory = async (req, res) => {
  const transactions = await getTransactionsByUser(req.user.userId);
  res.json(transactions);
};

module.exports = { viewBooks, requestCheckout, requestCheckin, viewBorrowingHistory };
