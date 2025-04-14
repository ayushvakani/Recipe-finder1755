import React, { useState } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  image?: string;
  source?: 'database' | 'spoonacular';
}

export default function RecipeSearch() {
  const [ingredients, setIngredients] = useState(['']);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const searchRecipes = async () => {
    setLoading(true);
    setError('');
    try {
      const validIngredients = ingredients
        .map(i => i.trim().toLowerCase())
        .filter(i => i !== '');

      // Get recipes from database
      const { data: dbRecipes, error: dbError } = await supabase
        .from('recipes')
        .select('*')
        .overlaps('ingredients', validIngredients)
        .order('name');
      
      if (dbError) throw dbError;

      let allRecipes: Recipe[] = (dbRecipes || []).map(recipe => ({
        ...recipe,
        source: 'database'
      }));

      // If ingredients are provided, also fetch from Spoonacular
      if (validIngredients.length > 0) {
        try {
          const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/recipe-search?ingredients=${validIngredients.join(',')}`;
          const response = await fetch(apiUrl, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          });
          
          if (!response.ok) {
            throw new Error('Failed to fetch external recipes');
          }
          
          const apiRecipes = await response.json();
          allRecipes = [...allRecipes, ...apiRecipes];
        } catch (apiError) {
          console.error('API Error:', apiError);
          // Don't throw here, just log the error and continue with DB results
        }
      }

      setRecipes(allRecipes);
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load database recipes when the component mounts
  React.useEffect(() => {
    searchRecipes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Recipes by Ingredients</h2>
        
        <div className="space-y-4">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="Enter an ingredient"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                onClick={() => removeIngredient(index)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Remove ingredient"
              >
                <Minus size={20} />
              </button>
            </div>
          ))}
          
          <button
            onClick={addIngredient}
            className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700"
          >
            <Plus size={20} />
            <span>Add ingredient</span>
          </button>
        </div>

        <button
          onClick={searchRecipes}
          disabled={loading}
          className="mt-6 w-full flex justify-center items-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
        >
          <Search size={20} />
          <span>{loading ? 'Searching...' : 'Search Recipes'}</span>
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {recipes.length > 0 ? 'Available Recipes' : 'No recipes found'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  {recipe.image && (
                    <img 
                      src={recipe.image} 
                      alt={recipe.name}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {recipe.name}
                      {recipe.source && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({recipe.source})
                        </span>
                      )}
                    </h4>
                    <div className="mt-2">
                      <h5 className="text-sm font-medium text-gray-700">Ingredients:</h5>
                      <ul className="mt-1 list-disc list-inside text-gray-600">
                        {recipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700">Instructions:</h5>
                      <p className="mt-1 text-gray-600 whitespace-pre-wrap">{recipe.instructions}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}