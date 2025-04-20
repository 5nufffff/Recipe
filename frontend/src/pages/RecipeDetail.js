import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`/api/recipes/${id}`);
        setRecipe(res.data);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
      }
    };
    fetchRecipe();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
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

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('user_id');
    const username = localStorage.getItem('username');

    if (newComment.trim() && userId && token) {
      try {
        const res = await axios.post('/api/comments', {
          recipe_id: id,
          user_id: userId,
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
      }
    }
  };

  if (!recipe) return <Typography sx={{ mt: 5, textAlign: 'center' }}>Loading recipe details...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        ← Back to Dashboard
      </Button>

      <Card elevation={3} id="printable">
        <CardMedia
          component="img"
          height="350"
          image={recipe.image || 'https://placehold.co/800x400?text=No+Image'}
          alt={recipe.title}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>{recipe.title}</Typography>
            <Box>
              <Tooltip title="Like">
                <IconButton onClick={() => setLiked(!liked)} color={liked ? 'error' : 'default'}>
                  <FavoriteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Print">
                <IconButton onClick={handlePrint}>
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Download">
                <IconButton onClick={handleDownload}>
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            <strong>By:</strong> {recipe.author || recipe.authorName || 'Unknown'}<br />
            <strong>Posted:</strong> {new Date(recipe.created_at || Date.now()).toLocaleDateString()}
          </Typography>

          {recipe.category && (
            <Typography variant="body2" color="primary" sx={{ fontStyle: 'italic' }}>
              Category: {recipe.category}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Ingredients</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {recipe.ingredients}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" gutterBottom>Instructions</Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {recipe.instructions}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography variant="h6" gutterBottom>Comments</Typography>
            {comments.map((cmt, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                • <strong>{cmt.username || 'User'}:</strong> {cmt.content || cmt}
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
