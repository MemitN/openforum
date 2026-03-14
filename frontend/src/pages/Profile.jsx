import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ThreadCard } from '../components/ThreadCard';
import { userAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Edit2, MessageSquare, FileText } from 'lucide-react';

export const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [bioInput, setBioInput] = useState('');

  const isOwnProfile = authUser?.id === id;

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, threadsRes] = await Promise.all([
        userAPI.getProfile(id),
        userAPI.getThreads(id, { limit: 10 })
      ]);

      setUser(profileRes.data.user);
      setBioInput(profileRes.data.user?.bio || '');
      setThreads(threadsRes.data.threads || []);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBio = async () => {
    try {
      const response = await userAPI.updateProfile({ bio: bioInput });
      setUser(response.data.user);
      setEditMode(false);
    } catch (err) {
      alert('Failed to update bio');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="card text-center py-12">
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !user) {
    return (
      <Layout>
        <div className="container">
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400">{error || 'User not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-24 h-24 rounded-full"
              onError={(e) => e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                {user.role === 'admin' && (
                  <span className="badge badge-primary">Admin</span>
                )}
                {user.role === 'moderator' && (
                  <span className="badge badge-secondary">Moderator</span>
                )}
              </div>
              <p className="text-gray-400 mb-4">{user.email}</p>

              {editMode && isOwnProfile ? (
                <div className="space-y-3">
                  <textarea
                    value={bioInput}
                    onChange={(e) => setBioInput(e.target.value)}
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                    className="input-field w-full resize-none"
                    rows="3"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveBio}
                      className="btn btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setBioInput(user.bio || '');
                      }}
                      className="btn btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-300">
                    {user.bio || 'No bio added yet'}
                  </p>
                  {isOwnProfile && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="mt-3 text-primary hover:text-primary-dark transition flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit Bio
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="border-t border-dark-border mt-6 pt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.threadsCount || 0}</div>
              <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
                <FileText size={14} />
                Threads
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{user.repliesCount || 0}</div>
              <div className="text-sm text-gray-400 flex items-center justify-center gap-1 mt-1">
                <MessageSquare size={14} />
                Replies
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A'}
              </div>
              <div className="text-sm text-gray-400">Joined</div>
            </div>
          </div>
        </div>

        {/* Threads Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Threads</h2>
          {threads.length > 0 ? (
            <div className="space-y-4">
              {threads.map((thread) => (
                <ThreadCard key={thread._id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="card text-center py-8">
              <p className="text-gray-400">
                {isOwnProfile ? "You haven't created any threads yet" : "No threads from this user"}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
