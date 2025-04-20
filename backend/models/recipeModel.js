const db = require('../config/db');

// Get all recipes with author name
exports.getAllRecipes = (callback) => {
  db.query(`
    SELECT recipes.*, users.name AS author 
    FROM recipes 
    JOIN users ON recipes.user_id = users.id
  `, callback);
};

// Add a new recipe
exports.addRecipe = (title, ingredients, instructions, image, user_id, callback) => {
  db.query(
    'INSERT INTO recipes (title, ingredients, instructions, image, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, ingredients, instructions, image, user_id],
    callback
  );
};

// Update existing recipe
exports.updateRecipe = (id, title, ingredients, instructions, image, callback) => {
  db.query(
    'UPDATE recipes SET title = ?, ingredients = ?, instructions = ?, image = ? WHERE id = ?',
    [title, ingredients, instructions, image, id],
    callback
  );
};

// Delete a recipe
exports.deleteRecipe = (id, callback) => {
  db.query('DELETE FROM recipes WHERE id = ?', [id], callback);
};
