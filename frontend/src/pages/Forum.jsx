import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ThreadCard } from '../components/ThreadCard';
import { threadAPI } from '../services/api';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Forum = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    fetchThreads();
  }, [searchParams]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const page = parseInt(searchParams.get('page') || '1');
      const response = await threadAPI.getAll({
        page,
        limit: 10,
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined
      });

      setThreads(response.data.threads || []);
      setPagination({
        page: response.data.currentPage,
        pages: response.data.pages,
        total: response.data.total
      });
    } catch (err) {
      setError('Failed to load threads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (search) newParams.set('search', search);
    if (category) newParams.set('category', category);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Forum</h1>
            <p className="text-gray-400">Showing {threads.length} of {pagination.total} discussions</p>
          </div>
          {isAuthenticated && (
            <Link to="/create-thread" className="btn btn-primary flex items-center gap-2 w-fit mt-4 md:mt-0">
              <Plus size={20} />
              New Thread
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search threads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="card text-center py-12">
            <p className="text-gray-400">Loading threads...</p>
          </div>
        )}

        {/* Threads List */}
        {!loading && threads.length > 0 && (
          <div className="space-y-4 mb-8">
            {threads.map((thread) => (
              <ThreadCard key={thread._id} thread={thread} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && threads.length === 0 && !error && (
          <div className="card text-center py-12">
            <p className="text-gray-400 text-lg">No threads found</p>
            <p className="text-gray-500 text-sm mt-2">
              {isAuthenticated ? 'Be the first to start a discussion!' : 'Sign in to create a new thread'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && !loading && (
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="btn btn-outline disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded ${
                  pagination.page === page
                    ? 'bg-primary text-white'
                    : 'border border-dark-border hover:border-primary'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="btn btn-outline disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};
