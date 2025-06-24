import React from 'react';
import { Heart, Github, Rocket } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center sm:text-left md:text-left">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Be Dare AI
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Empowering creators with AI-powered inspiration, support, and celebration.
            </p>
          </div>
          
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Submission
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Submitted for the <a href="https://worldslargesthackathon.devpost.com" target="_blank" className="text-indigo-600 underline">World’s Largest Hackathon</a> by Bolt.
            </p>
          </div>
          
          <div className="text-center sm:text-right md:text-right">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Connect
            </h4>
            <div className="flex justify-center md:justify-end space-x-4">
              <a 
                href="https://github.com/vero-code/be-dare-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://devpost.com/software/be-dare-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                aria-label="Follow on Devpost"
              >
                <Rocket className="w-5 h-5 text-indigo-500" />
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