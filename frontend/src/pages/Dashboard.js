import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Tabs, Tab, Container,
  Grid, Card, CardMedia, CardContent, CardActions, Fab,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Snackbar, Alert, Box, ToggleButton, ToggleButtonGroup, MenuItem, Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RecipeDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [allRecipes, setAllRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [openForm, setOpenForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: '',
    image: null,
    existingImage: ''
  });
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

  const sortRecipes = (recipes) => {
    switch (sortBy) {
      case 'newest':
        return [...recipes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return [...recipes].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'title-asc':
        return [...recipes].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...recipes].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return recipes;
    }
  };

  const filteredRecipes = sortRecipes(
    (activeTab === 0 ? allRecipes : myRecipes).filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.instructions.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || recipe.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
  );

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
      category: recipe.category || '',
      image: null,
      existingImage: recipe.image || ''
    } : {
      title: '',
      ingredients: '',
      instructions: '',
      category: '',
      image: null,
      existingImage: ''
    });
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
    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('ingredients', formData.ingredients);
    formPayload.append('instructions', formData.instructions);
    formPayload.append('category', formData.category);

    if (formData.image) {
      formPayload.append('image', formData.image);
    } else if (formData.existingImage) {
      formPayload.append('image', formData.existingImage);
    }

    const token = localStorage.getItem('token');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    };

    try {
      if (editingRecipe) {
        await axios.put(`/api/recipes/${editingRecipe.id}`, formPayload, config);
        showSnackbar('Recipe updated successfully!');
      } else {
        await axios.post('/api/recipes', formPayload, config);
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
      {/* ✅ Updated Navbar */}
      <AppBar position="static" sx={{ backgroundColor: '#2c3e50' }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '22px' }}>
              🍳 Ingredient Explorer
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ color: '#fff' }}>Hi, {userName} 👋</Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Box>
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

        <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Search Recipes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <ToggleButtonGroup
              color="primary"
              value={categoryFilter}
              exclusive
              onChange={(e, val) => setCategoryFilter(val || 'All')}
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="Veg">Veg</ToggleButton>
              <ToggleButton value="Non-Veg">Non-Veg</ToggleButton>
              <ToggleButton value="Vegan">Vegan</ToggleButton>
            </ToggleButtonGroup>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
              size="small"
              sx={{ minWidth: 150 }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="title-asc">Title A–Z</MenuItem>
              <MenuItem value="title-desc">Title Z–A</MenuItem>
            </Select>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {filteredRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card onClick={() => navigate(`/recipe/${recipe.id}`)} sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                <CardMedia component="img" height="200" image={recipe.image || placeholderImage} alt={recipe.title} />
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>By:</strong> {recipe.author || recipe.authorName}</Typography>
                  {recipe.category && (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'gray' }}>{recipe.category}</Typography>
                  )}
                  <Typography variant="body2"><strong>Ingredients:</strong> {recipe.ingredients}</Typography>
                  <Typography variant="body2"><strong>Instructions:</strong> {recipe.instructions}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FavoriteBorderIcon fontSize="small" />
                    <Typography variant="caption">12</Typography>
                  </Box>
                  {activeTab === 1 && (
                    <Box>
                      <Button size="small" onClick={(e) => { e.stopPropagation(); handleFormOpen(recipe); }}>Edit</Button>
                      <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(recipe.id); }}>Delete</Button>
                    </Box>
                  )}
                </CardActions>
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

      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" name="title" value={formData.title} onChange={handleInputChange} margin="dense" required />
          <TextField fullWidth label="Ingredients" name="ingredients" value={formData.ingredients} onChange={handleInputChange} margin="dense" multiline rows={2} required />
          <TextField fullWidth label="Instructions" name="instructions" value={formData.instructions} onChange={handleInputChange} margin="dense" multiline rows={2} required />
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Category</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['Veg', 'Non-Veg', 'Vegan'].map((option) => (
                <label key={option}>
                  <input
                    type="radio"
                    name="category"
                    value={option}
                    checked={formData.category === option}
                    onChange={handleInputChange}
                    style={{ marginRight: 6 }}
                  />
                  {option}
                </label>
              ))}
            </Box>
          </Box>
          <input type="file" name="image" accept="image/*" onChange={handleInputChange} style={{ marginTop: 10 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button onClick={handleFormSubmit} variant="contained">{editingRecipe ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ✅ Footer like Home page */}
      <footer style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'center', padding: '15px 0', marginTop: '40px' }}>
        <Typography variant="body2">© {new Date().getFullYear()} Ingredient Explorer. All rights reserved.</Typography>
      </footer>
    </div>
  );
};

export default RecipeDashboard;
