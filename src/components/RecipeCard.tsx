import React, { useState } from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
  image?: string;
  source?: 'database' | 'spoonacular';
  is_vegetarian?: boolean;
}

interface Comment {
  id: string;
  user_id: string;
  comment: string;
  created_at: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  onFavoriteToggle: () => void;
  isFavorited: boolean;
}

export default function RecipeCard({ recipe, onFavoriteToggle, isFavorited }: RecipeCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    const { data } = await supabase
      .from('recipe_comments')
      .select('*')
      .eq('recipe_id', recipe.id)
      .order('created_at', { ascending: false });
    
    if (data) setComments(data);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please login to comment');

      const { error } = await supabase
        .from('recipe_comments')
        .insert([{
          recipe_id: recipe.id,
          user_id: user.id,
          comment: newComment
        }]);

      if (error) throw error;
      setNewComment('');
      loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900">{recipe.name}</h3>
          {recipe.is_vegetarian !== undefined && (
            <span className={`inline-block px-2 py-1 rounded text-sm ${
              recipe.is_vegetarian ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {recipe.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onFavoriteToggle}
            className={`p-2 rounded-full ${
              isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-500'
            }`}
          >
            <Heart className={isFavorited ? 'fill-current' : ''} />
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-500"
          >
            <MessageSquare />
          </button>
        </div>
      </div>

      {recipe.image && (
        <img 
          src={recipe.image} 
          alt={recipe.name}
          className="mt-4 w-full h-48 object-cover rounded-md"
        />
      )}

      <div className="mt-4">
        <h4 className="font-medium text-gray-900">Ingredients:</h4>
        <ul className="mt-2 list-disc list-inside space-y-1">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-600">{ingredient}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h4 className="font-medium text-gray-900">Instructions:</h4>
        <p className="mt-2 text-gray-600 whitespace-pre-wrap">{recipe.instructions}</p>
      </div>

      {showComments && (
        <div className="mt-6 border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-4">Comments</h4>
          
          <form onSubmit={handleAddComment} className="mb-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              rows={2}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                <p className="text-gray-600">{comment.comment}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}