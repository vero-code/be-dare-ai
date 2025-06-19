import React from 'react';
import { Heart, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Be Dare AI
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Empowering creators with AI-powered inspiration, support, and celebration.
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Links
            </h4>
            <div className="space-y-2">
              <a href="#about" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                About
              </a>
              <a href="#privacy" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#support" className="block text-gray-600 hover:text-indigo-600 transition-colors duration-200">
                Support
              </a>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Connect
            </h4>
            <div className="flex justify-center md:justify-end space-x-4">
              <a 
                href="#" 
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                aria-label="Follow on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-gray-600 flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for creators everywhere</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;