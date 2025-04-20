const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController'); // 🔥 Make sure this path is correct

const verifyToken = require('../middleware/verifyToken');

// ROUTES
router.get('/', getAllRecipes);
router.post('/', verifyToken, addRecipe);
router.put('/:id', verifyToken, updateRecipe);
router.delete('/:id', verifyToken, deleteRecipe);

module.exports = router;
