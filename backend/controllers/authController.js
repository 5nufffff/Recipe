const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  userModel.createUser(name, email, hashed, (err) => {
    if (err) return res.status(500).json({ error: "Email may already exist" });
    res.json({ message: "Signup successful" });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  userModel.findByEmail(email, async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: "User not found" });
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(403).json({ error: "Invalid password" });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
  });
};

exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  const ADMIN_EMAIL = 'admin@admin.com';
  const ADMIN_PASSWORD = 'admin123'; // replace with env var or bcrypt if needed

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid admin credentials' });
};
