const pool = require("../config/db");
const asyncHandler = require("express-async-handler");

const {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
  getBookById,
} = require("../models/bookModel");

const {
  getTransactions,
  getTransactionById,
  updateTransaction,
} = require("../models/transactionModel");

const listBooks = async (req, res) => {
  try {
    const books = await getBooks();
    const { success, error } = req.query;
    res.render("admin-dashboard", { books, success, error });
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
};

const renderaddNewBook = (req, res) => {
  res.render("addnewbook");
};

const addNewBook = async (req, res) => {
  const { title, author, isbn, total_copies } = req.body;

  if (!title || !author || !isbn || !total_copies) {
    return res.render("addnewbook", { error: "All fields must be filled" });
  }

  if (isNaN(total_copies) || parseInt(total_copies) < 0) {
    return res.render("addnewbook", { error: "Total copies must be a positive integer" });
  }

  try {
    const existingBook = await getBookByISBN(isbn); 
    if (existingBook) {
      return res.render("addnewbook", { error: "ISBN must be unique" });
    }

    await addBook(title, author, isbn, total_copies);
    res.render("addnewbook", { success: "Book added successfully" });
  } catch (error) {
    res.render("addnewbook", { error: "Error adding book" });
  }
};

const getBookByISBN = async (isbn) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE isbn = ?', [isbn]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching book by ISBN:', error);
    throw error;
  }
};

const getBookDetails = async (id) => {
  return await getBookById(id);
};

const handleBookUpdate = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, total_copies } = req.body;
  try {
    await updateBook(id, title, author, isbn, total_copies);
    res.redirect(`/api/admin/books/${id}?success=true`); 
  } catch (error) {
    res.redirect(`/api/admin/books/${id}?error=Error updating book details`); 
  }
};

const renderUpdateForm = async (req, res) => {
  const { id } = req.params;
  const { success, error } = req.query;
  try {
    const book = await getBookDetails(id);
    res.render("updateBookDetails", { book, success, error });
  } catch (error) {
    res.status(500).send("Error retrieving book details");
  }
};
const isBookCheckedOut = async (id) => {
  const query = `
    SELECT * FROM transactions 
    WHERE book_id =? AND transaction_type = 'checkout' AND return_date IS NULL AND status = 'approved'
  `;
  const res = await pool.query(query, [id]); 
  return res[0].length > 0;
};

const removeBook = async (req, res) => {
  const { id } = req.params;
  try {
    const checkedOut = await isBookCheckedOut(id);
    if (checkedOut) {
      return res.redirect("/api/admin/books?error=Cannot%20delete%20checked%20out%20book");
    }
    
    await deleteBook(id);
    res.redirect("/api/admin/books?success=Book%20deleted%20successfully");
  } catch (error) {
    console.error(error);
    res.redirect("/api/admin/books?error=Error%20deleting%20book");
  }
};

const viewAdminRequests = asyncHandler(async (req, res) => {
  try {
    const [requests] = await pool.execute(
      "SELECT ar.id, ar.user_id, u.username, ar.status FROM admin_requests ar JOIN users u ON ar.user_id = u.id WHERE ar.status = 'pending'"
    );

    res.render("admin-requests", { requests, success: null, error: null });
  } catch (error) {
    res.status(500).send("Error fetching admin requests");
  }
});

const approveAdminRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.body;

  try {
    const [requests] = await pool.execute(
      "SELECT ar.id, ar.user_id, u.username, ar.status FROM admin_requests ar JOIN users u ON ar.user_id = u.id WHERE ar.status = 'pending'"
    );

    const [request] = await pool.execute(
      "SELECT * FROM admin_requests WHERE id = ?",
      [requestId]
    );
    if (request.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Request not found." });
    }

    const userId = request[0].user_id;
    await pool.execute("UPDATE users SET is_admin = 1 WHERE id = ?", [userId]);
    await pool.execute(
      "UPDATE admin_requests SET status = 'approved' WHERE id = ?",
      [requestId]
    );

    res.render("admin-requests", {
      requests,
      success: "Admin request approved.",
      error: null,
    });
  } catch (error) {
    res.status(500).send("Error approving admin request");
  }
});

const denyAdminRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.body;

  try {
    const [requests] = await pool.execute(
      "SELECT ar.id, ar.user_id, u.username, ar.status FROM admin_requests ar JOIN users u ON ar.user_id = u.id WHERE ar.status = 'pending'"
    );

    const [request] = await pool.execute(
      "SELECT * FROM admin_requests WHERE id = ?",
      [requestId]
    );
    if (request.length === 0) {
      return res
        .status(404)
        .json({ success: false, msg: "Request not found." });
    }

    await pool.execute(
      "UPDATE admin_requests SET status = 'denied' WHERE id = ?",
      [requestId]
    );

    res.render("admin-requests", {
      requests,
      success: "Admin request denied.",
      error: null,
    });
  } catch (error) {
    res.status(500).send("Error denying admin request");
  }
});

const listTransactions = async (req, res) => {
  try {
    const transactions = await getTransactions();
    res.render("transactions", { transactions, error: null, success: null });
  } catch (error) {
    res.render("transactions", {
      transactions: [],
      error: "Error fetching transactions",
      success: null,
    });
  }
};

const approveCheckoutRequest = async (req, res) => {
  const { transactionId } = req.body;

  try {
    const transaction = await getTransactionById(transactionId);
    if (!transaction || transaction.transaction_type !== "checkout") {
      return res.render("transactions", {
        transactions: await getTransactions(),
        error: "Invalid checkout transaction",
        success: null,
      });
    }

    await updateTransaction(transactionId, { status: "approved" });
    res.render("transactions", {
      transactions: await getTransactions(),
      success: "Checkout request approved",
      error: null,
    });
  } catch (error) {
    res.render("transactions", {
      transactions: await getTransactions(),
      error: "Error approving checkout request",
      success: null,
    });
  }
};

const disapproveCheckoutRequest = async (req, res) => {
  const { transactionId } = req.body;

  try {
    const transaction = await getTransactionById(transactionId);
    if (!transaction || transaction.transaction_type !== "checkout") {
      return res.render("transactions", {
        transactions: await getTransactions(),
        error: "Invalid checkout transaction",
        success: null,
      });
    }

    await updateTransaction(transactionId, { status: "disapproved" });
    res.render("transactions", {
      transactions: await getTransactions(),
      success: "Checkout request disapproved",
      error: null,
    });
  } catch (error) {
    res.render("transactions", {
      transactions: await getTransactions(),
      error: "Error disapproving checkout request",
      success: null,
    });
  }
};

const approveCheckinRequest = async (req, res) => {
  const { transactionId } = req.body;

  try {
    const transaction = await getTransactionById(transactionId);
    if (!transaction || transaction.transaction_type !== "checkin") {
      return res.render("transactions", {
        transactions: await getTransactions(),
        error: "Invalid checkin transaction",
        success: null,
      });
    }

    await updateTransaction(transactionId, { status: "approved" });
    res.render("transactions", {
      transactions: await getTransactions(),
      success: "Checkin request approved",
      error: null,
    });
  } catch (error) {
    res.render("transactions", {
      transactions: await getTransactions(),
      error: "Error approving checkin request",
      success: null,
    });
  }
};

const disapproveCheckinRequest = async (req, res) => {
  const { transactionId } = req.body;

  try {
    const transaction = await getTransactionById(transactionId);
    if (!transaction || transaction.transaction_type !== "checkin") {
      return res.render("transactions", {
        transactions: await getTransactions(),
        error: "Invalid checkin transaction",
        success: null,
      });
    }

    await updateTransaction(transactionId, { status: "disapproved" });
    res.render("transactions", {
      transactions: await getTransactions(),
      success: "Checkin request disapproved",
      error: null,
    });
  } catch (error) {
    res.render("transactions", {
      transactions: await getTransactions(),
      error: "Error disapproving checkin request",
      success: null,
    });
  }
};

module.exports = {
  listBooks,
  renderaddNewBook,
  addNewBook,
  renderUpdateForm,
  removeBook,
  viewAdminRequests,
  approveAdminRequest,
  denyAdminRequest,
  listTransactions,
  handleBookUpdate,
  approveCheckoutRequest,
  disapproveCheckoutRequest,
  approveCheckinRequest,
  disapproveCheckinRequest,
};
