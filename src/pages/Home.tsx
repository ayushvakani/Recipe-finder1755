import React from 'react';
import { Link } from 'react-router-dom';
import { CookingPot, Search, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <CookingPot className="h-16 w-16 text-emerald-600 mx-auto" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Find the Perfect Recipe
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Enter your available ingredients and discover delicious recipes you can make right now.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <Search className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Search by Ingredients</h3>
              <p className="mt-2 text-gray-500">
                Find recipes based on ingredients you have at home.
              </p>
              <Link
                to="/search"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Start Searching
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <UserPlus className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Create an Account</h3>
              <p className="mt-2 text-gray-500">
                Save your favorite recipes and contribute to our community.
              </p>
              <Link
                to="/register"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2 lg:col-span-1">
            <div className="px-4 py-5 sm:p-6">
              <CookingPot className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Browse Recipes</h3>
              <p className="mt-2 text-gray-500">
                Explore our collection of delicious recipes from around the world.
              </p>
              <Link
                to="/search"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Browse All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}