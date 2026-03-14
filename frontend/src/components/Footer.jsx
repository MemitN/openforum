import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-dark-surface border-t border-dark-border mt-12">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-bold text-lg text-primary mb-4">AI/ML Forum</h3>
            <p className="text-gray-400 text-sm">
              A community-driven platform for AI and Machine Learning enthusiasts to discuss, learn, and share knowledge.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Forum</a></li>
              <li><a href="#" className="hover:text-primary transition">Categories</a></li>
              <li><a href="#" className="hover:text-primary transition">Users</a></li>
              <li><a href="#" className="hover:text-primary transition">Tags</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition">Guidelines</a></li>
              <li><a href="#" className="hover:text-primary transition">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms</a></li>
              <li><a href="#" className="hover:text-primary transition">Code of Conduct</a></li>
              <li><a href="#" className="hover:text-primary transition">License</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-dark-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 AI & Machine Learning Forum. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-primary transition text-sm">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition text-sm">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition text-sm">
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
