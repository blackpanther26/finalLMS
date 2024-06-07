const isUser = (req, res, next) => {
  if (req.user && !req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send("Access denied. Users only.");
  }
};

module.exports = isUser;
