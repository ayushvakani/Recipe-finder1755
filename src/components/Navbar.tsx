import React from 'react';
import { Link } from 'react-router-dom';
import { CookingPot, User, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <CookingPot className="h-8 w-8 text-emerald-600" />
              <span className="text-xl font-bold text-gray-800">RecipeFinder</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/search" className="text-gray-600 hover:text-gray-900">Find Recipes</Link>
            {user ? (
              <>
                <Link to="/add-recipe" className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700">
                  <PlusCircle size={20} />
                  <span>Add Recipe</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Login</Link>
                <Link to="/register" className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;