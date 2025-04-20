const db = require('../config/db');

exports.getUsers = (req, res) => {
  db.query('SELECT id, name, email, role FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: 'Fetch users failed' });
    res.json(results);
  });
};

exports.deleteUser = (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'User deleted' });
  });
};

exports.deleteRecipe = (req, res) => {
  db.query('DELETE FROM recipes WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'Delete failed' });
    res.json({ message: 'Recipe deleted' });
  });
};
