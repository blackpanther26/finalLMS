const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.JWT_SECRET; 

const cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log('JWT Cookie:', token); // Debugging log

  if (!token) {
    console.log('No JWT token found in cookies'); // Debugging log
    return res.status(401).send('Access Denied');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log('Invalid JWT token'); // Debugging log
      return res.status(401).send('Access Denied');
    }
    req.user = decoded;
    next();
  });
};

module.exports = cookieJwtAuth;
