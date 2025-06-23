import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-500 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Be Dare AI
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Your Pre-publish Companion
              </p>
            </div>
          </div>
          <nav className="flex items-center">
            <a
              href="https://bolt.new"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4"
              aria-label="Built with Bolt.new"
            >
              <img
                src="/badges/black_circle_360x360.png"
                alt="Built with Bolt.new"
                className="w-14 h-14 sm:w-20 sm:h-20 hover:opacity-90 transition"
              />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;