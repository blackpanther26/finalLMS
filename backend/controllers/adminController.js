const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../models/bookModel");
const { updateUserRole, getUserByUsername } = require("../models/userModel");
const { getTransactions, getTransactionById, updateTransaction } = require('../models/transactionModel');


const listBooks = async (req, res) => {
  try {
    const books = await getBooks();
    res.json(books);
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
};

const addNewBook = async (req, res) => {
  const { title, author, isbn } = req.body;
  try {
    await addBook(title, author, isbn);
    res.send("Book added successfully");
  } catch (error) {
    res.status(500).send("Error adding book");
  }
};

const updateBookDetails = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn } = req.body;
  try {
    await updateBook(id, title, author, isbn);
    res.send("Book updated successfully");
  } catch (error) {
    res.status(500).send("Error updating book details");
  }
};

const removeBook = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteBook(id);
    res.send("Book deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting book");
  }
};

const approveAdminRequest = async (req, res) => {
  const { username } = req.body;

  try {
    // Check if the user exists
    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Toggle the is_admin field
    const newIsAdminValue = !user.is_admin;

    // Update the user's role
    await updateUserRole(username, newIsAdminValue);

    res.send("Admin request approved");
  } catch (error) {
    res.status(500).send("Error approving admin request");
  }
};

const listTransactions = async (req, res) => {
  try {
    const transactions = await getTransactions();
    res.json(transactions);
  } catch (error) {
    res.status(500).send("Error fetching transactions");
  }
};

const approveCheckoutRequest = async (req, res) => {
  const { transactionId } = req.body;

  try {
    // Get the transaction by ID
    const transaction = await getTransactionById(transactionId);
    if (!transaction || transaction.type !== 'checkout') {
      return res.status(400).send('Invalid checkout transaction');
    }

    // Update the transaction status to approved
    await updateTransaction(transactionId, { status: 'approved' });

    res.send('Checkout request approved');
  } catch (error) {
    res.status(500).send("Error approving checkout request");
  }
};

const approveCheckinRequest = async (req, res) => {
  const { transactionId } = req.body;

  try {
    // Get the transaction by ID
    const transaction = await getTransactionById(transactionId);
    if (!transaction || transaction.type !== 'checkin') {
      return res.status(400).send('Invalid checkin transaction');
    }

    // Update the transaction status to approved
    await updateTransaction(transactionId, { status: 'approved' });

    res.send('Checkin request approved');
  } catch (error) {
    res.status(500).send("Error approving checkin request");
  }
};


module.exports = {
  listBooks,
  addNewBook,
  updateBookDetails,
  removeBook,
  approveAdminRequest,
  listTransactions,
  approveCheckoutRequest,
  approveCheckinRequest
};
