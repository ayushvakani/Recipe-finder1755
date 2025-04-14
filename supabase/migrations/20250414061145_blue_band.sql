/*
  # Add Sample Recipes

  1. Changes
    - Add initial set of recipes to the recipes table
    - Each recipe includes:
      - Name
      - List of ingredients
      - Detailed cooking instructions
*/

INSERT INTO recipes (name, ingredients, instructions) VALUES
  (
    'Classic Spaghetti Carbonara',
    ARRAY['spaghetti', 'eggs', 'pecorino cheese', 'black pepper', 'guanciale'],
    'Cook pasta until al dente. In a bowl, mix eggs, cheese, and pepper. Crisp guanciale in a pan. Toss hot pasta with egg mixture and guanciale. Serve immediately with extra cheese and pepper.'
  ),
  (
    'Simple Chicken Stir-Fry',
    ARRAY['chicken breast', 'broccoli', 'carrots', 'soy sauce', 'garlic', 'ginger'],
    'Cut chicken into cubes. Stir-fry garlic and ginger. Add chicken until cooked. Add vegetables and stir-fry until tender. Season with soy sauce.'
  ),
  (
    'Vegetarian Lentil Soup',
    ARRAY['red lentils', 'onion', 'carrots', 'celery', 'vegetable broth', 'cumin'],
    'Sauté onions, carrots, and celery. Add lentils, broth, and cumin. Simmer until lentils are tender. Season to taste.'
  ),
  (
    'Quick Tomato Pasta',
    ARRAY['pasta', 'tomatoes', 'garlic', 'olive oil', 'basil'],
    'Cook pasta. Sauté garlic in olive oil. Add tomatoes and cook until saucy. Toss with pasta and fresh basil.'
  ),
  (
    'Basic Omelette',
    ARRAY['eggs', 'butter', 'cheese', 'salt', 'pepper'],
    'Beat eggs with salt and pepper. Melt butter in pan. Pour eggs and cook until set. Add cheese, fold, and serve.'
  );