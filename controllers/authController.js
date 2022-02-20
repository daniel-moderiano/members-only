const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");

// User reaches sign up page on GET route. No frills, display form
exports.signupGet = function(req, res) {
  res.render('signup', { title: 'Sign Up' });
};

exports.signupPost = function(req, res) {
  // bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
  //   const user = new User({
  //     username: req.body.username,
  //     password: hashedPassword,
  //   }).save(err => {
  //     if (err) { 
  //       return next(err);
  //     }
  //     res.redirect("/");
  //   });
  // });
  const user = {
    // If checkbox is left unchecked, the req.body will not even register the checkbox fields. By using a conditional that checks for the presence of isAdmin in req.body, we can deduce whether it has been checked or not
    isAdmin: req.body.isAdmin ? true : false
  }
  console.log(user);
  res.redirect('/sign-up');
}
