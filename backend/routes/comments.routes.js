const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const {
  postComment,
  getComments,
  removeComment
} = require('../controllers/comments.controller');

router.post('/', verifyToken, postComment);
router.get('/:recipeId', getComments);
router.delete('/:id', verifyToken, removeComment);

module.exports = router;
