const db = require('../config/db'); // your db connection file

const addComment = (recipe_id, user_id, content) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO comments (recipe_id, user_id, content)
      VALUES (?, ?, ?)
    `;
    db.query(query, [recipe_id, user_id, content], (err, result) => {
      if (err) return reject(err);
      // Get the username for response
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

module.exports = { addComment };
