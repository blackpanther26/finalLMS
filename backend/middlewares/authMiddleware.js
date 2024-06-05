const { verifyToken } = require('../utils/jwt');
//const cookieParser = require('cookie-parser'); // Ensure you use cookie-parser middleware in your main app

const authMiddleware = (req, res, next) => {

  const token = req.cookies.jwt;
  console.log('JWT Cookie:', token); 

  if (!token) {
    console.log('No JWT token found in cookies'); // Debugging log
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
