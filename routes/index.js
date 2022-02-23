var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');
const { isAuth } = require('./authMiddleware');
const Message = require('../models/message');

/* GET home page. */
router.get('/', function(req, res, next) {
  // Retrieve all message from the db
  Message.find({})
    .sort({ timestamp: 1 })
    .populate('author')
    .exec((err, messageList) => {
      if (err) { return next(err) }
      // Successful, so render index and pass all messages along to view template
      res.render('index', { title: "Member's Only", messages: messageList });
    });
});

// Sign in GET route
router.get('/sign-up', function(req, res, next) {
  res.render('signup', { title: 'Sign up' });
});

// Sign in POST route (register new user)
router.post('/sign-up', authController.signupPost);

// Log in GET route
router.get('/log-in', function(req, res) {
  res.render('login', { title: 'Log in' })
});

// Log in POST route (authenticate user)
router.post('/log-in', authController.loginPost);

// Member signup GET route
router.get('/member-signup', (req, res) => {
  res.render('member-signup', { title: 'Join the club!' });
});

// Member signup POST route
router.post('/member-signup', authController.memberPost);

// Logout get route (when user clicks log out btn)
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/');
});

router.get('/protected-route', isAuth, (req, res, next) => {
  res.send('You made it to the protected route');
})

module.exports = router;
