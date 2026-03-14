import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Clock } from 'lucide-react';

export const ThreadCard = ({ thread }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link to={`/thread/${thread._id}`}>
      <div className="card hover:border-primary transition">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white hover:text-primary transition line-clamp-2">
              {thread.title}
            </h3>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <span>by {thread.author?.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {formatDate(thread.createdAt)}
              </span>
            </div>
          </div>
          {thread.solved && (
            <span className="badge badge-success ml-2">Solved</span>
          )}
        </div>

        {/* Category Badge */}
        <div className="mb-3">
          <span
            className="badge text-xs"
            style={{
              backgroundColor: thread.category?.color || '#2563eb',
              color: 'white'
            }}
          >
            {thread.category?.name}
          </span>
        </div>

        {/* Content Preview */}
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">
          {thread.content}
        </p>

        {/* Tags */}
        {thread.tags && thread.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {thread.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-xs bg-dark-bg text-secondary px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 text-xs text-gray-400 pt-3 border-t border-dark-border">
          <div className="flex items-center gap-1">
            <MessageSquare size={14} />
            {thread.repliesCount} replies
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            {thread.views} views
          </div>
        </div>
      </div>
    </Link>
  );
};
