const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const passport = require("passport");

// User reaches sign up page on GET route. No frills, display form
exports.signupGet = function(req, res) {
  res.render('signup', { title: 'Sign Up' });
};

// Create hashed password and save new user to db
exports.signupPost = [
  // Validate and sanitise fields
  body('fullName', 'Name is required').trim().isLength({ min: 1 }).escape(),
  body('username', 'A valid email is required').trim().isLength({ min: 1 }).isEmail().escape(),
  body('password', 'Minimum password length is 6 characters').trim().isLength({ min: 6 }).escape(),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    // Indicates the success of the validator, so return true valuie
    return true;
  }),

  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitised values and error messages. Note password is left out for security reasons
      res.render('signup', { 
        title: 'Sign Up', 
        user: {
          fullName: req.body.fullName,
          username: req.body.username,
          isAdmin: req.body.isAdmin ? true : false,
        }, 
        errors: errors.array() 
      });
    } else {
      // Data from form is valid
      //  Perform password hashing
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // Create new user object with validated and sanitised data
        const user = new User({
          fullName: req.body.fullName,
          username: req.body.username,
          password: hashedPassword,
          // If checkbox is left unchecked, the req.body will not even register the checkbox fields. By using a conditional that checks for the presence of isAdmin in req.body, we can deduce whether it has been checked or not
          isAdmin: req.body.isAdmin ? true : false,
          isMember: false, // Default to false; set within app
        }).save(err => {
          if (err) { 
            return next(err);
          }
          
          res.redirect("/");
        });
      });
    }
  },
];


// Handle authenticating user on login
exports.loginPost = [
  // Validate and sanitise fields
  body('username', 'Please enter your username (email address)').trim().isLength({ min: 1 }).isEmail().escape(),
  body('password', 'Please enter your password').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {

    // Extract the validation errors from a request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitised values and error messages. Note password is left out for security reasons
      res.render('login', { 
        title: 'Log in', 
        user: {
          username: req.body.username,
        }, 
        errors: errors.array() 
      });
    } else {
      // Data from form is valid. Pass to next middleware (authentication)
      next();
    }
  },

  // Authenticate with local strategy. Note 
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/log-in",
  })
];
