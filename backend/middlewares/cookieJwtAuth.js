const jwt = require('jsonwebtoken');
require("dotenv").config();
const secretKey = process.env.JWT_SECRET; 

const cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
  
      return res.status(401).send('Access Denied');
    }
    req.user = decoded;
    next();
  });
};

module.exports = cookieJwtAuth;
