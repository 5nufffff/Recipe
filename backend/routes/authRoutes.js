const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');

router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/admin-login', auth.adminLogin); // ✅ admin login

module.exports = router;
