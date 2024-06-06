const adminMiddleware = (req, res, next) => {
  if (req.user.is_admin===0) {
    return res.status(403).send('Access Denied');
  }
  next();
};

module.exports = adminMiddleware;
