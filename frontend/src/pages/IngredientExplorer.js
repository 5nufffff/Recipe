import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { TextField, ToggleButton, ToggleButtonGroup, Select, MenuItem, Box, Typography } from '@mui/material';

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const placeholderImage = 'https://placehold.co/300x200?text=No+Image';

  useEffect(() => {
    axios.get('/api/recipes')
      .then(res => setRecipes(res.data))
      .catch(err => console.error('Failed to load recipes', err));
  }, []);

  const sortRecipes = (list) => {
    switch (sortBy) {
      case 'newest':
        return [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      case 'oldest':
        return [...list].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      case 'title-asc':
        return [...list].sort((a, b) => a.title.localeCompare(b.title));
      case 'title-desc':
        return [...list].sort((a, b) => b.title.localeCompare(a.title));
      default:
        return list;
    }
  };

  const filteredRecipes = sortRecipes(
    recipes.filter((recipe) => {
      const matchesSearch = recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.instructions?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || recipe.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
  );

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8f9fa', color: '#333' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#2c3e50', padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#fff', fontSize: '28px' }}>🍳 Ingredient Explorer</h1>
        <div>
          <button onClick={() => navigate('/login')} style={navBtn('#3498db')}>Login</button>
          <button onClick={() => navigate('/signup')} style={navBtn('#2ecc71')}>Sign Up</button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ background: 'url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80) center/cover no-repeat', color: '#fff', padding: '100px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '48px', marginBottom: '10px' }}>Discover and Share Amazing Recipes</h2>
        <p style={{ fontSize: '20px', maxWidth: '700px', margin: 'auto' }}>Cook something new today! Find recipes from around the world and contribute your own favorites.</p>
        <button onClick={() => navigate('/signup')} style={{ ...navBtn('#e67e22'), marginTop: '20px', fontSize: '18px' }}>Join Us</button>
      </section>

      {/* About Section */}
      <section style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>About Ingredient Explorer</h2>
        <p style={{ fontSize: '18px', maxWidth: '800px', margin: 'auto', lineHeight: '1.6' }}>
          Ingredient Explorer is your digital cookbook — a platform where culinary creativity meets convenience.
          Whether you're a seasoned chef or a home cook, you can explore, share, and save delicious recipes tailored to your taste.
        </p>
      </section>

      {/* Explore Recipes */}
      <section style={{ padding: '60px 40px', backgroundColor: '#fff' }}>
        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '30px' }}>Explore Recipes</h2>

        {/* 🔍 Search + Filter + Sort */}
        <Box sx={{ maxWidth: '1000px', margin: 'auto', mb: 4 }}>
          <TextField
            fullWidth
            label="Search Recipes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
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
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="title-asc">Title A–Z</MenuItem>
              <MenuItem value="title-desc">Title Z–A</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Card Display */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} style={{
              backgroundColor: '#fafafa',
              border: '1px solid #ddd',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
              width: '300px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <img src={recipe.image || placeholderImage} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{recipe.title}</h3>
                <p style={{ fontSize: '14px', color: '#888' }}><strong>Author:</strong> {recipe.author || 'Anonymous'}</p>
                <p style={{ fontSize: '14px', marginTop: '10px' }}><strong>Ingredients:</strong> {recipe.ingredients?.slice(0, 60)}...</p>
                {recipe.category && (
                  <p style={{ fontSize: '13px', fontStyle: 'italic', color: '#777', marginTop: '6px' }}><strong>Category:</strong> {recipe.category}</p>
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#fff',
                padding: '4px 8px',
                borderRadius: '20px',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)'
              }}>
                <FavoriteBorderIcon fontSize="small" />
                <span style={{ fontSize: '12px' }}>12</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '60px 40px', backgroundColor: '#ecf0f1', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '10px' }}>Contact Us</h2>
        <p style={{ fontSize: '16px', maxWidth: '700px', margin: 'auto', lineHeight: '1.5' }}>
          Have questions or suggestions? We’d love to hear from you!
        </p>
        <p style={{ fontSize: '18px', marginTop: '15px' }}><strong>Email:</strong> support@ingredientexplorer.com</p>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'center', padding: '15px 0' }}>
        <p>© {new Date().getFullYear()} Ingredient Explorer. All rights reserved.</p>
      </footer>
    </div>
  );
};

const navBtn = (bgColor) => ({
  backgroundColor: bgColor,
  color: '#fff',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginLeft: '10px'
});

export default Home;
