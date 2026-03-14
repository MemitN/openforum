import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { ReplyItem } from '../components/ReplyItem';
import { threadAPI, replyAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { MessageSquare, Eye, Clock, Send } from 'lucide-react';

export const ThreadDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchThreadData();
  }, [id]);

  const fetchThreadData = async () => {
    try {
      setLoading(true);
      const [threadRes, repliesRes] = await Promise.all([
        threadAPI.getById(id),
        replyAPI.getByThread(id, { limit: 100 })
      ]);

      setThread(threadRes.data.thread);
      setReplies(repliesRes.data.replies || []);
    } catch (err) {
      setError('Failed to load thread');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      const response = await replyAPI.create(id, { content: replyContent });
      setReplies([...replies, response.data.reply]);
      setReplyContent('');
    } catch (err) {
      alert('Failed to submit reply');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = (replyId) => {
    setReplies(replies.filter(r => r._id !== replyId));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <div className="card text-center py-12">
            <p className="text-gray-400">Loading thread...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !thread) {
    return (
      <Layout>
        <div className="container">
          <div className="bg-red-900 bg-opacity-20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400">{error || 'Thread not found'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-400">
          <Link to="/forum" className="hover:text-primary">Forum</Link>
          <span className="mx-2">/</span>
          <Link to={`/forum?category=${thread.category?.slug}`} className="hover:text-primary">
            {thread.category?.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-white">{thread.title}</span>
        </div>

        {/* Thread Header */}
        <div className="card mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{thread.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>Posted by <strong>{thread.author?.username}</strong></span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {formatDate(thread.createdAt)}
                </span>
              </div>
            </div>
            {thread.solved && (
              <span className="badge badge-success">Solved</span>
            )}
          </div>

          <div className="border-t border-dark-border pt-4 mb-4">
            <p className="text-gray-300 whitespace-pre-wrap mb-4">{thread.content}</p>

            {/* Tags */}
            {thread.tags && thread.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {thread.tags.map((tag, idx) => (
                  <span key={idx} className="text-xs bg-dark-bg text-secondary px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-gray-400 pt-4 border-t border-dark-border">
            <div className="flex items-center gap-1">
              <Eye size={16} />
              {thread.views} views
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare size={16} />
              {thread.repliesCount} replies
            </div>
          </div>
        </div>

        {/* Author Info */}
        <div className="mb-8 p-4 bg-dark-surface border border-dark-border rounded-lg">
          <div className="flex items-center gap-4">
            <img
              src={thread.author?.avatar}
              alt={thread.author?.username}
              className="w-12 h-12 rounded-full"
              onError={(e) => e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
            />
            <div className="flex-1">
              <p className="font-semibold text-white">{thread.author?.username}</p>
              <p className="text-sm text-gray-400">{thread.author?.bio || 'No bio'}</p>
            </div>
            <Link to={`/profile/${thread.author?._id}`} className="btn btn-outline">
              View Profile
            </Link>
          </div>
        </div>

        {/* Replies Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{replies.length} Replies</h2>

          {replies.length > 0 && (
            <div className="space-y-4 mb-8">
              {replies.map((reply) => (
                <ReplyItem
                  key={reply._id}
                  reply={reply}
                  onDelete={handleDeleteReply}
                />
              ))}
            </div>
          )}

          {replies.length === 0 && (
            <div className="card text-center py-8 mb-8">
              <p className="text-gray-400">No replies yet. Be the first to reply!</p>
            </div>
          )}
        </div>

        {/* Reply Form */}
        {isAuthenticated ? (
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">Add Your Reply</h3>
            <form onSubmit={handleReplySubmit}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Share your thoughts, solutions, or comments..."
                rows="6"
                className="input-field w-full mb-4 resize-none"
                required
              />
              <button
                type="submit"
                disabled={submitting || !replyContent.trim()}
                className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card text-center py-8">
            <p className="text-gray-400 mb-4">Sign in to participate in the discussion</p>
            <div className="flex gap-4 justify-center">
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
