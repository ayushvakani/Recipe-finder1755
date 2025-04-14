/*
  # Add recipe features

  1. New Tables
    - `recipe_comments` - Store user comments on recipes
    - `user_favorite_recipes` - Store user's favorite recipes
  
  2. Updates
    - Add `is_vegetarian` column to recipes table
    - Add `user_submitted` column to recipes table
  
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Add new columns to recipes table
ALTER TABLE recipes 
ADD COLUMN IF NOT EXISTS is_vegetarian BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_submitted BOOLEAN DEFAULT false;

-- Create comments table
CREATE TABLE IF NOT EXISTS recipe_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT fk_recipe_comments_recipe FOREIGN KEY (recipe_id) REFERENCES recipes(id),
  CONSTRAINT fk_recipe_comments_user FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable RLS on comments
ALTER TABLE recipe_comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Users can read all comments"
  ON recipe_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own comments"
  ON recipe_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON recipe_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON recipe_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create favorites table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_favorite_recipes (
  user_id UUID REFERENCES auth.users(id),
  recipe_id UUID REFERENCES recipes(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

-- Enable RLS on favorites
ALTER TABLE user_favorite_recipes ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can manage their own favorites"
  ON user_favorite_recipes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);