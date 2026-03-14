import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { replyAPI } from '../services/api';

export const ReplyItem = ({ reply, onDelete, onUpdate }) => {
  const { user } = useAuth();
  const [voting, setVoting] = useState(false);
  const [localReply, setLocalReply] = useState(reply);
  const isAuthor = user?.id === reply.author._id;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpvote = async () => {
    if (voting) return;
    setVoting(true);
    try {
      const response = await replyAPI.upvote(reply._id);
      setLocalReply(response.data.reply);
    } catch (error) {
      console.error('Failed to upvote:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleDownvote = async () => {
    if (voting) return;
    setVoting(true);
    try {
      const response = await replyAPI.downvote(reply._id);
      setLocalReply(response.data.reply);
    } catch (error) {
      console.error('Failed to downvote:', error);
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await replyAPI.delete(reply._id);
        onDelete(reply._id);
      } catch (error) {
        alert('Failed to delete reply');
      }
    }
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-3 pb-3 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <img
            src={reply.author.avatar}
            alt={reply.author.username}
            className="w-10 h-10 rounded-full"
            onError={(e) => e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
          />
          <div>
            <p className="font-semibold text-white">{reply.author.username}</p>
            <p className="text-xs text-gray-400">{formatDate(reply.createdAt)}</p>
            {reply.isEdited && <p className="text-xs text-gray-500">(edited)</p>}
          </div>
        </div>
        {isAuthor && (
          <div className="flex items-center gap-2">
            <button
              className="text-gray-400 hover:text-white transition"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <p className="text-gray-300 mb-4 whitespace-pre-wrap">
        {localReply.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleUpvote}
          disabled={voting}
          className="flex items-center gap-1 text-gray-400 hover:text-green-500 transition disabled:opacity-50"
        >
          <ThumbsUp size={16} />
          <span className="text-sm">{localReply.upvotes}</span>
        </button>
        <button
          onClick={handleDownvote}
          disabled={voting}
          className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition disabled:opacity-50"
        >
          <ThumbsDown size={16} />
          <span className="text-sm">{localReply.downvotes}</span>
        </button>
      </div>
    </div>
  );
};
