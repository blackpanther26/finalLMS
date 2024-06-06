const express = require("express");
const router = express.Router();

const authController = require('../controllers/authController');

const { registerValidator, loginValidator } = require('../helpers/validator');

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/register', registerValidator, authController.registerUser);

router.post('/login', loginValidator, authController.loginUser);

module.exports = router;
