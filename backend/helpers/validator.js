const { check } = require("express-validator");
exports.registerValidator = [
  check("username", "Name is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
];
exports.loginValidator = [
  check("username", "Name is required").not().isEmpty(),
  check("password", "Password is required").not().isEmpty(),
];
