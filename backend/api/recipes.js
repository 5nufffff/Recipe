const express = require('express');
const router = express.Router();
const {
  getAllRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe  // ✅ Add this
} = require('../controllers/recipeController');

const verifyToken = require('../middleware/verifyToken');

// ROUTES
router.get('/', getAllRecipes);                     // Public: Get all recipes
router.post('/', verifyToken, addRecipe);           // Protected: Add recipe
router.put('/:id', verifyToken, updateRecipe);      // Protected: Update recipe
router.delete('/:id', verifyToken, deleteRecipe);   // ✅ Protected: Delete recipe

module.exports = router;
