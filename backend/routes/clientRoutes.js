const express = require("express");
const {
  viewBooks,
  requestCheckout,
  requestCheckin,
  viewBorrowingHistory,
  requestAdminPrivilege,
  searchBooks,
} = require("../controllers/clientController");
const authMiddleware = require("../middlewares/authMiddleware");
const isUser = require('../middlewares/isUser');
const router = express.Router();

router.use(authMiddleware);
router.use(isUser);
router.get("/", viewBooks);
router.get("/books", viewBooks);
router.post("/checkout", requestCheckout);
router.post("/checkin", requestCheckin);
router.get("/history", viewBorrowingHistory);
router.get("/search", searchBooks);
router.post("/request-admin", requestAdminPrivilege);

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/api/login");
});

module.exports = router;