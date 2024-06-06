const express = require('express');
const { 
  listBooks,
  renderaddNewBook, 
  addNewBook, 
  renderUpdateForm, 
  handleBookUpdate,
  removeBook, 
  approveAdminRequest,
  denyAdminRequest,
  viewAdminRequests, 
  listTransactions, 
  approveCheckoutRequest, 
  disapproveCheckoutRequest, 
  approveCheckinRequest, 
  disapproveCheckinRequest
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/", listBooks);
router.get('/books', listBooks);
router.post('/addNewBook', addNewBook);
router.get('/addNewBook',renderaddNewBook);
router.get('/books/:id', renderUpdateForm);
router.post('/books/:id', handleBookUpdate);

//router.put('/books/:id', updateBookDetails);
//router.delete('/books/:id', removeBook);
router.post('/books/delete/:id', removeBook);
router.get('/transactions', listTransactions);
router.post('/transactions/checkout/approve', approveCheckoutRequest);
router.post('/transactions/checkout/disapprove', disapproveCheckoutRequest);
router.post('/transactions/checkin/approve', approveCheckinRequest);
router.post('/transactions/checkin/disapprove', disapproveCheckinRequest);
router.get("/admin-requests", viewAdminRequests);
router.post("/admin-requests/approve", approveAdminRequest);
router.post("/admin-requests/deny", denyAdminRequest);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/api/login");
});

module.exports = router;
