var express = require('express');
var router = express.Router();
const authController = require('../controllers/authController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/sign-up', function(req, res, next) {
  res.render('signup', { title: 'Sign up' });
});

router.post('/sign-up', authController.signupPost);

module.exports = router;
