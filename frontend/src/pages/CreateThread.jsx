import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { threadAPI, categoryAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

export const CreateThread = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchCategories();
  }, [isAuthenticated, navigate]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories || []);
      if (response.data.categories && response.data.categories.length > 0) {
        setFormData(prev => ({
          ...prev,
          category: response.data.categories[0]._id
        }));
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.content || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      const response = await threadAPI.create(payload);
      navigate(`/thread/${response.data.thread._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create thread. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Create New Thread</h1>
          <p className="text-gray-400 mb-8">Start a discussion with the community</p>

          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card">
            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Be specific about what you're asking..."
                maxLength={200}
                className="input-field w-full"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 characters</p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Provide details about your question or topic..."
                rows="10"
                className="input-field w-full resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Be detailed and specific to get better answers</p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">Tags (Optional)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="machine-learning, neural-networks, python (comma-separated)"
                className="input-field w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Add up to 5 tags separated by commas</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t border-dark-border">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Thread'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};
