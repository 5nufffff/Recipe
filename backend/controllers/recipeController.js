const recipeModel = require('../models/recipeModel');
const path = require('path');

// GET /api/recipes
exports.getAllRecipes = (req, res) => {
  recipeModel.getAllRecipes((err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      return res.status(500).json({ message: 'Failed to fetch recipes' });
    }
    res.json(results);
  });
};

// ✅ GET /api/recipes/:id (for RecipeDetail page)
exports.getRecipeById = (req, res) => {
  const { id } = req.params;

  recipeModel.getRecipeById(id, (err, result) => {
    if (err) {
      console.error("Error fetching recipe:", err);
      return res.status(500).json({ message: "Failed to fetch recipe" });
    }
    if (!result) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(result);
  });
};

// POST /api/recipes
exports.addRecipe = (req, res) => {
  const { title, ingredients, instructions, category } = req.body;
  const user = req.user;

  if (!title || !ingredients || !instructions || !user?.id) {
    return res.status(400).json({ message: "Missing required fields or invalid token" });
  }

  const user_id = user.id;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  recipeModel.addRecipe(title, ingredients, instructions, image, category, user_id, (err, result) => {
    if (err) {
      console.error("Error inserting recipe:", err);
      return res.status(500).json({ message: "Failed to add recipe", error: err });
    }
    res.status(201).json({ message: "Recipe added successfully" });
  });
};

// PUT /api/recipes/:id
exports.updateRecipe = (req, res) => {
  const { title, ingredients, instructions, category } = req.body;
  const { id } = req.params;
  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || '';

  recipeModel.updateRecipe(id, title, ingredients, instructions, image, category, (err) => {
    if (err) {
      console.error('Error updating recipe:', err);
      return res.status(500).json({ message: 'Failed to update recipe' });
    }
    res.json({ message: 'Recipe updated successfully' });
  });
};

// DELETE /api/recipes/:id
exports.deleteRecipe = (req, res) => {
  const { id } = req.params;

  recipeModel.deleteRecipe(id, (err) => {
    if (err) {
      console.error('Error deleting recipe:', err);
      return res.status(500).json({ message: 'Failed to delete recipe' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  });
};
