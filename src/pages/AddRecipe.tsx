import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CookingPot } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AddRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [''],
    instructions: '',
    is_vegetarian: false
  });

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      setRecipe({
        ...recipe,
        ingredients: recipe.ingredients.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please login to add recipes');

      const { error: submitError } = await supabase
        .from('recipes')
        .insert([{
          name: recipe.name,
          ingredients: recipe.ingredients.filter(i => i.trim() !== ''),
          instructions: recipe.instructions,
          is_vegetarian: recipe.is_vegetarian,
          created_by: user.id,
          user_submitted: true
        }]);

      if (submitError) throw submitError;
      navigate('/search');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <CookingPot className="h-8 w-8 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">Add Your Recipe</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              value={recipe.name}
              onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  value={ingredient}
                  onChange={(e) => handleIngredientChange(index, e.target.value)}
                  placeholder="Enter an ingredient"
                />
                {recipe.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="mt-2 text-emerald-600 hover:text-emerald-700"
            >
              Add Ingredient
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              value={recipe.instructions}
              onChange={(e) => setRecipe({ ...recipe, instructions: e.target.value })}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_vegetarian"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              checked={recipe.is_vegetarian}
              onChange={(e) => setRecipe({ ...recipe, is_vegetarian: e.target.checked })}
            />
            <label htmlFor="is_vegetarian" className="ml-2 block text-sm text-gray-700">
              This is a vegetarian recipe
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            {loading ? 'Adding Recipe...' : 'Add Recipe'}
          </button>
        </form>
      </div>
    </div>
  );
}