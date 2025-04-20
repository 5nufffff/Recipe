const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/signup', auth.signup);  // POST /api/signup
router.post('/login', auth.login);    // POST /api/login

module.exports = router;
