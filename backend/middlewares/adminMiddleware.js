const adminMiddleware = (req, res, next) => {
  //console.log('Authenticated User:', req.user); // Debugging log
  if (req.user.is_admin===0) {
    //console.log('Access Denied: User is not an admin'); // Debugging log
    return res.status(403).send('Access Denied');
  }
  next();
};

module.exports = adminMiddleware;
