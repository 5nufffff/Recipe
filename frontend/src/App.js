// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IngredientExplorer from './pages/IngredientExplorer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import RecipeDetail from './pages/RecipeDetail';
import AdminPanel from './pages/AdminPanel';
import PrivateRoute from './components/PrivateRoutes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/recipe/:id' element={<RecipeDetail />} />
        <Route path="/" element={<IngredientExplorer />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
                }
                />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
