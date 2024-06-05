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
  const transactions = await getTransactionsByUser(req.user.userId);
  res.json(transactions);
};

module.exports = { viewBooks, requestCheckout, requestCheckin, viewBorrowingHistory };
