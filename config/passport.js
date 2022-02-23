const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Can define custom fields that passport will look for in the body to fill the strategy inputs below. Pass it to the local strategy
// const customFields = {
//   usernameField: 'uname',
//   passwordField: 'pw'
// }

const verifyCallback = (username, password, done) => {
  User.findOne({ username: username }, (err, user) => {
    if (err) { // API error
      return done(err);
    }
    if (!user) {
      // User does not exist in db, alert user and return 401. Note the 'null' passed in means no error occurred
      return done(null, false, { message: "Incorrect username" });
    }
    // User exists in db, need to compare hashed/salted passwords
    
    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // Passwords match, user is verified, credentials are valid. User object is returned
        return done(null, user);
      } else {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
      }
    });
  });
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});