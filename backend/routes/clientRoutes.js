const express = require("express");
const {
  viewBooks,
  requestCheckout,
  requestCheckin,
  viewBorrowingHistory,
} = require("../controllers/clientController");
const authMiddleware = require("../middlewares/authMiddleware");
//const cookieJwtAuth = require('../middlewares/cookieJwtAuth');
const router = express.Router();
//router.use(cookieJwtAuth);
router.use(authMiddleware);

// router.get('/',(req,res)=>{
//     res.render("user-portal");
// })
router.get("/", viewBooks);
router.get("/books", viewBooks);
router.post("/checkout", requestCheckout);
router.post("/checkin", requestCheckin);
router.get("/history", viewBorrowingHistory);

router.get("/logout", (req, res) => {
  
  res.redirect("/api/login");
  res.clearCookie("jwt");
});

module.exports = router;
