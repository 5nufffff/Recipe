import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const recipesRes = await axios.get('/api/recipes');

        setUsers(usersRes.data);
        setRecipes(recipesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load admin data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // ✅ FIXED dependency warning

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await axios.delete(`/api/admin/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecipes(recipes.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Users */}
      <Typography variant="h5" gutterBottom mt={3}>
        Users
      </Typography>
      <Grid container spacing={2}>
        {users.map(user => (
          <Grid item xs={12} md={6} key={user.id}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography><strong>Name:</strong> {user.name}</Typography>
              <Typography><strong>Email:</strong> {user.email}</Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteUser(user.id)}
                sx={{ mt: 1 }}
              >
                Delete User
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recipes */}
      <Typography variant="h5" gutterBottom mt={5}>
        All Recipes
      </Typography>
      <Grid container spacing={2}>
        {recipes.map(recipe => (
          <Grid item xs={12} md={6} key={recipe.id}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6">{recipe.title}</Typography>
              <img
                src={recipe.image || 'https://placehold.co/300x200?text=No+Image'}
                alt={recipe.title}
                width="100%"
                style={{ borderRadius: '5px', marginTop: '10px' }}
              />
              <Typography sx={{ mt: 1 }}><strong>Author:</strong> {recipe.author || 'Anonymous'}</Typography>
              <Typography><strong>Ingredients:</strong> {recipe.ingredients}</Typography>
              <Typography><strong>Instructions:</strong> {recipe.instructions}</Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteRecipe(recipe.id)}
                sx={{ mt: 1 }}
              >
                Delete Recipe
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdminPanel;
