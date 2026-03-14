import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ThreadCard } from '../components/ThreadCard';
import { CategoryCard } from '../components/CategoryCard';
import { threadAPI, categoryAPI } from '../services/api';
import { Users, MessageSquare, TrendingUp } from 'lucide-react';

export const Home = () => {
  const [stats, setStats] = useState(null);
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, threadsRes, categoriesRes] = await Promise.all([
        threadAPI.getStats().catch(() => ({ data: { stats: {} } })),
        threadAPI.getAll({ limit: 5 }),
        categoryAPI.getAll()
      ]);

      setStats(statsRes.data.stats || {});
      setThreads(threadsRes.data.threads || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (err) {
      setError('Failed to load forum data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI & Machine Learning Forum
            </h1>
            <p className="text-lg text-gray-100 mb-6">
              Join a vibrant community of AI/ML enthusiasts, researchers, and practitioners. Share ideas, ask questions, and learn together.
            </p>
            <Link to="/forum" className="btn btn-primary inline-block">
              Explore Forum
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {stats.totalThreads || 0}
              </div>
              <div className="text-gray-400 flex items-center justify-center gap-2">
                <MessageSquare size={16} />
                Threads
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {stats.totalUsers || 0}
              </div>
              <div className="text-gray-400 flex items-center justify-center gap-2">
                <Users size={16} />
                Members
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-accent mb-2">
                {stats.totalReplies || 0}
              </div>
              <div className="text-gray-400 flex items-center justify-center gap-2">
                <TrendingUp size={16} />
                Replies
              </div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-indigo-500 mb-2">
                {stats.totalCategories || 0}
              </div>
              <div className="text-gray-400">Categories</div>
            </div>
          </div>
        )}

        {/* Categories Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Featured Categories</h2>
            <Link to="/categories" className="text-primary hover:text-primary-dark transition">
              View All →
            </Link>
          </div>
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.slice(0, 6).map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-400">No categories available yet</p>
            </div>
          )}
        </div>

        {/* Recent Threads Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Recent Discussions</h2>
            <Link to="/forum" className="text-primary hover:text-primary-dark transition">
              View All →
            </Link>
          </div>
          {threads.length > 0 ? (
            <div className="space-y-4">
              {threads.map((thread) => (
                <ThreadCard key={thread._id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-400">No threads yet. Be the first to start a discussion!</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Join?</h2>
          <p className="text-gray-400 mb-6">
            Start participating in discussions and connect with the AI/ML community today.
          </p>
          <Link to="/register" className="btn btn-primary inline-block">
            Create an Account
          </Link>
        </div>
      </div>
    </Layout>
  );
};
