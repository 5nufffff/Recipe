const express = require('express');
const router = express.Router();
const admin = require('../controllers/adminController');
const verify = require('../middleware/verifyToken');

router.get('/users', verify, admin.getUsers);
router.delete('/users/:id', verify, admin.deleteUser);
router.delete('/recipes/:id', verify, admin.deleteRecipe);

module.exports = router;