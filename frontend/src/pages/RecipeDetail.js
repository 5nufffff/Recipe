import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Card, CardMedia, CardContent, Button
} from '@mui/material';
import axios from 'axios';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await axios.get(`/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (error) {
        console.error('Failed to fetch recipe:', error);
      }
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 5 }}>
      <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
      <Card sx={{ mt: 3 }}>
        <CardMedia
          component="img"
          height="300"
          image={recipe.image || 'https://placehold.co/600x400?text=No+Image'}
          alt={recipe.title}
        />
        <CardContent>
          <Typography variant="h4">{recipe.title}</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            <strong>By:</strong> {recipe.author || recipe.authorName}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Ingredients:</strong><br />{recipe.ingredients}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Instructions:</strong><br />{recipe.instructions}
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeDetail;
