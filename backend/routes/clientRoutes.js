const express = require('express');
const { viewBooks, requestCheckout, requestCheckin, viewBorrowingHistory } = require('../controllers/clientController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/books', viewBooks);
router.post('/checkout', requestCheckout);
router.post('/checkin', requestCheckin);
router.get('/history', viewBorrowingHistory);

module.exports = router;
