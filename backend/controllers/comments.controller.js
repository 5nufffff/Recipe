const { addComment, getCommentsByRecipe, deleteComment } = require('../models/comments.model');

const postComment = async (req, res) => {
  const { recipe_id, user_id, content } = req.body;

  if (!recipe_id || !user_id || !content) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const comment = await addComment(recipe_id, user_id, content);
    res.status(201).json(comment);
  } catch (err) {
    console.error('❌ Error adding comment:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getComments = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const comments = await getCommentsByRecipe(recipeId);
    res.json(comments);
  } catch (err) {
    console.error('❌ Error getting comments:', err);
    res.status(500).json({ message: 'Failed to load comments' });
  }
};

const removeComment = async (req, res) => {
  try {
    await deleteComment(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    console.error('Error deleting comment:', err);
    res.status(500).json({ message: 'Failed to delete comment' });
  }
};

module.exports = { postComment, getComments, removeComment };
