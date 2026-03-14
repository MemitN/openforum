import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { CategoryCard } from '../components/CategoryCard';
import { categoryAPI } from '../services/api';

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Forum Categories</h1>
          <p className="text-lg text-gray-400">
            Browse all available categories and find discussions that interest you.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="card text-center py-12">
            <p className="text-gray-400">Loading categories...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Categories Grid */}
        {!loading && categories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && categories.length === 0 && !error && (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg">No categories found</p>
            <p className="text-gray-500 text-sm mt-2">Check back later for new categories</p>
          </div>
        )}
      </div>
    </Layout>
  );
};
