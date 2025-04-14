import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Recipe {
  id: string;
  is_vegetarian?: boolean;
}

interface RecipeStatsProps {
  recipes: Recipe[];
}

export default function RecipeStats({ recipes }: RecipeStatsProps) {
  const vegCount = recipes.filter(r => r.is_vegetarian).length;
  const nonVegCount = recipes.filter(r => r.is_vegetarian === false).length;
  const unspecifiedCount = recipes.filter(r => r.is_vegetarian === undefined).length;

  const data = [
    { name: 'Vegetarian', value: vegCount },
    { name: 'Non-Vegetarian', value: nonVegCount },
    { name: 'Unspecified', value: unspecifiedCount }
  ].filter(item => item.value > 0);

  const COLORS = ['#10B981', '#EF4444', '#6B7280'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recipe Statistics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}