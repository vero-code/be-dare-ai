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
          <nav className="hidden sm:flex items-center space-x-6">
            <a 
              href="#about" 
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              aria-label="About Be Dare AI"
            >
              About
            </a>
            <a 
              href="#help" 
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
              aria-label="Get help"
            >
              Help
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;