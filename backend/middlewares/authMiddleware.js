const { verifyToken } = require('../utils/jwt');

const authMiddleware = (req, res, next) => {

  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = verifyToken(token);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authMiddleware;
