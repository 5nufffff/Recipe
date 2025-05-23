const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const commentRoutes = require('./routes/comments.routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api/recipes', require('./routes/recipeRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/comments', commentRoutes);
app.get('/test', (req, res) => {
    res.send('Backend is working!');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));