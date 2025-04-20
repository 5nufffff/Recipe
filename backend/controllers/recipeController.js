const recipeModel = require('../models/recipeModel');

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

// POST /api/recipes
exports.addRecipe = (req, res) => {
  const { title, ingredients, instructions, image } = req.body;
  const user = req.user;

  console.log("🔵 POST /api/recipes called");
  console.log("➡️  req.body:", req.body);
  console.log("➡️  req.user:", user);

  // Defensive check
  if (!title || !ingredients || !instructions || !user?.id) {
    console.warn("⚠️ Missing fields or user_id");
    return res.status(400).json({ message: "Missing required fields or invalid token" });
  }

  const user_id = user.id;

  recipeModel.addRecipe(title, ingredients, instructions, image || '', user_id, (err, result) => {
    if (err) {
      console.error("❌ DB Insert Error:", err);
      return res.status(500).json({ message: "Database insert failed", error: err });
    }
    console.log("✅ Recipe added to database");
    res.status(201).json({ message: "Recipe added successfully" });
  });
};


// PUT /api/recipes/:id
exports.updateRecipe = (req, res) => {
  const { title, ingredients, instructions, image } = req.body;
  const { id } = req.params;

  recipeModel.updateRecipe(id, title, ingredients, instructions, image, (err) => {
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
