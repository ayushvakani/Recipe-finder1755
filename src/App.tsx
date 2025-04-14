import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CookingPot } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeSearch from './pages/RecipeSearch';
import AddRecipe from './pages/AddRecipe';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<RecipeSearch />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;