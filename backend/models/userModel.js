const db = require('../config/db');

exports.findByEmail = (email, callback) => {
  db.query('SELECT * FROM users WHERE email = ?', [email], callback);
};

exports.createUser = (name, email, hashedPassword, callback) => {
  db.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword],
    callback
  );
};

exports.getAllUsers = (callback) => {
  db.query('SELECT id, name, email FROM users', callback);
};

exports.deleteUser = (id, callback) => {
  db.query('DELETE FROM users WHERE id = ?', [id], callback);
};
