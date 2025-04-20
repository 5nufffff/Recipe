const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, deleteRecipe } = require('../controllers/adminController');
const verifyToken = require('../middleware/verifyToken');

router.get('/users', verifyToken, getUsers);
router.delete('/users/:id', verifyToken, deleteUser);
router.delete('/recipes/:id', verifyToken, deleteRecipe);

module.exports = router;
