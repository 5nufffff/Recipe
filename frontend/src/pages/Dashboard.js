import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Tabs, Tab, Container,
  Grid, Card, CardMedia, CardContent, CardActions, Fab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const RecipeDashboard = () => {
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [allRecipes, setAllRecipes] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({ title: '', ingredients: '', instructions: '', image: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const placeholderImage = 'https://placehold.co/400x250?text=No+Image';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.name || 'User');
        setUserId(payload.id || payload.userId);
      } catch {
        setUserName('User');
        setUserId(1);
      }
    }
  }, []);

  useEffect(() => {
    fetchAllRecipes();
  }, [userId]);

  const fetchAllRecipes = async () => {
    try {
      const res = await axios.get('/api/recipes');
      setAllRecipes(res.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const myRecipes = allRecipes.filter(r => r.user_id === userId);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleFormOpen = (recipe = null) => {
    setEditingRecipe(recipe);
    setFormData(recipe ? {
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image: null
    } : { title: '', ingredients: '', instructions: '', image: null });
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditingRecipe(null);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({ ...prev, image: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: formData.title,
      ingredients: formData.ingredients,
      instructions: formData.instructions,
      image: '',
      user_id: userId,
    };
    const token = localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    };
    try {
      if (editingRecipe) {
        await axios.put(`/api/recipes/${editingRecipe.id}`, data, config);
        showSnackbar('Recipe updated successfully!');
      } else {
        await axios.post('/api/recipes', data, config);
        showSnackbar('Recipe added successfully!');
      }
      fetchAllRecipes();
      handleFormClose();
    } catch (error) {
      console.error('Form error:', error);
      showSnackbar('Failed to save recipe', 'error');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`/api/recipes/${id}`, config);
      fetchAllRecipes();
      showSnackbar('Recipe deleted');
    } catch (error) {
      console.error('Delete error:', error);
      showSnackbar('Failed to delete', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <div>
      <AppBar position="static" sx={{ backgroundColor: '#34495e' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Hi, {userName} 👋</Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ bgcolor: '#f4f6f8', py: 4, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom>My Recipe Dashboard</Typography>
        <Typography variant="subtitle1">Create, explore and manage your recipes with ease</Typography>
      </Box>

      <Container sx={{ mt: 3 }}>
        <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} centered>
          <Tab label="All Recipes" />
          <Tab label="My Recipes" />
        </Tabs>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {(activeTab === 0 ? allRecipes : myRecipes).map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia component="img" height="200" image={recipe.image || placeholderImage} alt={recipe.title} />
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>By:</strong> {recipe.author || recipe.authorName}</Typography>
                  <Typography variant="body2"><strong>Ingredients:</strong> {recipe.ingredients}</Typography>
                  <Typography variant="body2"><strong>Instructions:</strong> {recipe.instructions}</Typography>
                </CardContent>
                {activeTab === 1 && (
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button size="small" onClick={() => handleFormOpen(recipe)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(recipe.id)}>Delete</Button>
                  </CardActions>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>

        {activeTab === 1 && (
          <Fab color="primary" sx={{ position: 'fixed', bottom: 30, right: 30 }} onClick={() => handleFormOpen()}>
            <AddIcon />
          </Fab>
        )}
      </Container>

      {/* Recipe Form Dialog */}
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} margin="dense" required />
          <TextField fullWidth label="Ingredients" name="ingredients" value={formData.ingredients} onChange={handleInputChange} margin="dense" multiline rows={2} required />
          <TextField fullWidth label="Instructions" name="instructions" value={formData.instructions} onChange={handleInputChange} margin="dense" multiline rows={2} required />
          <input type="file" name="image" accept="image/*" onChange={handleInputChange} style={{ marginTop: 10 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">{editingRecipe ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RecipeDashboard;
