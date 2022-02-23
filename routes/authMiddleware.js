// Pass this middleware before any route that you wish to protect from unauthorised users
module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ msg: 'You are not authorised to view this resource' })
  }
};

// Pass this middleware before any route that you wish to protect from non-admin users
module.exports.isAdmin = (req, res, next) => {

};