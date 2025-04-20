const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipeController');

const verifyToken = require('../middleware/verifyToken');

// File storage setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ ROUTES
router.get('/', getAllRecipes);                 // GET all recipes
router.get('/:id', getRecipeById);              // ✅ GET single recipe by ID
router.post('/', verifyToken, upload.single('image'), addRecipe);     // POST new recipe
router.put('/:id', verifyToken, upload.single('image'), updateRecipe); // PUT update recipe
router.delete('/:id', verifyToken, deleteRecipe); // DELETE recipe

module.exports = router;
