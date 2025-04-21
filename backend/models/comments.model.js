const db = require('../config/db');

const addComment = (recipe_id, user_id, content) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO comments (recipe_id, user_id, content)
      VALUES (?, ?, ?)
    `;
    db.query(query, [recipe_id, user_id, content], (err, result) => {
      if (err) return reject(err);
      const selectQuery = `
        SELECT c.id, c.content, u.name AS username 
        FROM comments c 
        JOIN users u ON c.user_id = u.id 
        WHERE c.id = ?
      `;
      db.query(selectQuery, [result.insertId], (err2, rows) => {
        if (err2) return reject(err2);
        resolve(rows[0]);
      });
    });
  });
};

const getCommentsByRecipe = (recipe_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT c.id, c.content, u.name AS username 
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.recipe_id = ?
      ORDER BY c.created_at ASC
    `;
    db.query(query, [recipe_id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const deleteComment = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM comments WHERE id = ?', [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

module.exports = { addComment, getCommentsByRecipe, deleteComment };
