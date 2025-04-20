const db = require('../config/db'); // or your DB connection path

// GET all recipes
exports.getAllRecipes = (callback) => {
  const query = `
    SELECT r.*, u.name AS authorName
    FROM recipes r
    JOIN users u ON r.user_id = u.id
    ORDER BY r.created_at DESC
  `;
  db.query(query, callback);
};

// ✅ GET one recipe by ID (for RecipeDetail)
exports.getRecipeById = (id, callback) => {
  const query = `
    SELECT 
      r.id, r.title, r.ingredients, r.instructions, r.image, 
      r.category, r.created_at, u.name AS author
    FROM recipes r
    JOIN users u ON r.user_id = u.id
    WHERE r.id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]); // return single recipe
  });
};

// POST a new recipe
exports.addRecipe = (title, ingredients, instructions, image, category, user_id, callback) => {
  const query = `
    INSERT INTO recipes (title, ingredients, instructions, image, category, user_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [title, ingredients, instructions, image, category, user_id], callback);
};

// PUT update recipe
exports.updateRecipe = (id, title, ingredients, instructions, image, category, callback) => {
  const query = `
    UPDATE recipes
    SET title = ?, ingredients = ?, instructions = ?, image = ?, category = ?
    WHERE id = ?
  `;
  db.query(query, [title, ingredients, instructions, image, category, id], callback);
};

// DELETE recipe
exports.deleteRecipe = (id, callback) => {
  const query = `DELETE FROM recipes WHERE id = ?`;
  db.query(query, [id], callback);
};
