import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  return (
    <Link to={`/forum?category=${category.slug}`}>
      <div className="card hover:border-primary transition">
        <div className="flex items-start gap-4 mb-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-lg"
            style={{ backgroundColor: category.color }}
          >
            {category.icon ? category.icon.charAt(0) : '📚'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white hover:text-primary transition">
              {category.name}
            </h3>
          </div>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {category.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-dark-border">
          <span className="text-xs text-gray-400">
            {category.threadsCount} threads
          </span>
          <div className="flex items-center gap-1 text-primary text-sm">
            <MessageSquare size={14} />
            View
          </div>
        </div>
      </div>
    </Link>
  );
};
