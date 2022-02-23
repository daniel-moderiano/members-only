var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

module.exports = router;
