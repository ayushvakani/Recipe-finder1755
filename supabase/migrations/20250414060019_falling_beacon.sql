/*
  # Recipe Recommendation System Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
    - `recipes`
      - `id` (uuid, primary key)
      - `name` (text)
      - `ingredients` (text[])
      - `instructions` (text)
      - `created_by` (uuid, references users.id)
      - `created_at` (timestamp)
    - `user_favorite_recipes`
      - `user_id` (uuid, references users.id)
      - `recipe_id` (uuid, references recipes.id)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tables
CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  ingredients text[] NOT NULL,
  instructions text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_favorite_recipes (
  user_id uuid REFERENCES auth.users(id),
  recipe_id uuid REFERENCES recipes(id),
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read recipes"
  ON recipes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create recipes"
  ON recipes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can manage their favorites"
  ON user_favorite_recipes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);