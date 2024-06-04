const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader); // Debugging log

  if (!authHeader) {
    console.log('No Authorization header present'); // Debugging log
    return res.status(401).send('Access Denied');
  }

  const token = authHeader.split(' ')[1]; // Remove 'Bearer' prefix if present
  console.log('Extracted Token:', token); // Debugging log

  if (!token) {
    console.log('No token found after splitting Authorization header'); // Debugging log
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = verifyToken(token);
    console.log('Verified User:', verified); // Debugging log
    req.user = verified;
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message); // Debugging log
    res.status(400).send('Invalid Token');
  }
};

module.exports = authMiddleware;
