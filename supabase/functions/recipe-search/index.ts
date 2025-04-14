import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const SPOONACULAR_API_KEY = '91fd0eb73ea343e9b6c068085fa5a9a0';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: { original: string }[];
  missedIngredients: { original: string }[];
  instructions?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const ingredients = url.searchParams.get('ingredients');

    if (!ingredients) {
      return new Response(
        JSON.stringify({ error: 'Ingredients parameter is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Call Spoonacular API
    const spoonacularUrl = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&ranking=2&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`;
    const response = await fetch(spoonacularUrl);
    const recipes: SpoonacularRecipe[] = await response.json();

    // Get detailed instructions for each recipe
    const detailedRecipes = await Promise.all(
      recipes.map(async (recipe) => {
        const instructionsUrl = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`;
        const detailsResponse = await fetch(instructionsUrl);
        const details = await detailsResponse.json();
        
        return {
          id: `sp_${recipe.id}`,
          name: recipe.title,
          image: recipe.image,
          ingredients: [
            ...recipe.usedIngredients.map(i => i.original),
            ...recipe.missedIngredients.map(i => i.original)
          ],
          instructions: details.instructions || 'Instructions not available',
          source: 'spoonacular'
        };
      })
    );

    return new Response(
      JSON.stringify(detailedRecipes),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});