const express = require("express");
const router = express.Router(); // Use Router instead of app

const authController = require('../controllers/authController');

const { registerValidator, loginValidator } = require('../helpers/validator');

// Render register view
router.get('/register', (req, res) => {
    res.render('register');
});

// Render login view
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle registration POST request
router.post('/register', registerValidator, authController.registerUser);

// Handle login POST request
router.post('/login', loginValidator, authController.loginUser);

module.exports = router;
