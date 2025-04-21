// RecipeDetail.js
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Card, CardMedia, CardContent, Button,
  Box, Divider, TextField, IconButton, Tooltip
} from '@mui/material';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const fetchRecipe = useCallback(async () => {
    try {
      const res = await axios.get(`/api/recipes/${id}`);
      setRecipe(res.data);
    } catch (error) {
      console.error('Failed to fetch recipe:', error);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await axios.get(`/api/comments/${id}`);
      setComments(res.data || []);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchRecipe();
    fetchComments();
  }, [fetchRecipe, fetchComments]);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('token');
    const user_id = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    if (!token || !user_id) {
      alert("You must be logged in to comment.");
      return;
    }

    if (!newComment.trim()) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const res = await axios.post('/api/comments', {
        recipe_id: id,
        user_id,
        content: newComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newCmt = res.data || {
        content: newComment,
        username: username || 'You'
      };

      setComments(prev => [...prev, newCmt]);
      setNewComment('');
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert(error.response?.data?.message || 'Failed to post comment');
    }
  };

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (!recipe) return;
    const content = `
Title: ${recipe.title}
Author: ${recipe.author || 'Unknown'}
Ingredients: ${recipe.ingredients}
Instructions: ${recipe.instructions}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${recipe.title}.txt`;
    a.click();
  };

  if (!recipe) {
    return <Typography sx={{ mt: 5, textAlign: 'center' }}>Loading recipe details...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ← Back to Dashboard
      </Button>

      <Card elevation={3}>
        <CardMedia
          component="img"
          height="350"
          image={recipe.image || 'https://placehold.co/800x400?text=No+Image'}
          alt={recipe.title}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" fontWeight="bold">{recipe.title}</Typography>
            <Box>
              <Tooltip title="Like">
                <IconButton onClick={() => setLiked(!liked)} color={liked ? 'error' : 'default'}>
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint}><PrintIcon /></IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton onClick={handleDownload}><DownloadIcon /></IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <strong>By:</strong> {recipe.author || 'Anonymous'}<br />
            <strong>Posted:</strong> {new Date(recipe.created_at || Date.now()).toLocaleDateString()}
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Ingredients</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{recipe.ingredients}</Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Instructions</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>{recipe.instructions}</Typography>
          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom>Comments</Typography>
            {comments.length === 0 && <Typography>No comments yet.</Typography>}
            {comments.map((cmt, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                • <strong>{cmt.username || 'User'}:</strong> {cmt.content}
              </Typography>
            ))}
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="contained" onClick={handleCommentSubmit}>Post</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
