const express = require('express');
const { 
  listBooks, 
  addNewBook, 
  updateBookDetails, 
  removeBook, 
  approveAdminRequest, 
  listTransactions, 
  approveCheckoutRequest, 
  approveCheckinRequest 
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const router = express.Router();

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/books', listBooks);
router.post('/books', addNewBook);
router.put('/books/:id', updateBookDetails);
router.delete('/books/:id', removeBook);
router.post('/approve-admin', approveAdminRequest);
router.get('/transactions', listTransactions);
router.post('/transactions/checkout/approve', approveCheckoutRequest);
router.post('/transactions/checkin/approve', approveCheckinRequest);

module.exports = router;
