import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';

const WelcomeSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      role="main"
      aria-labelledby="welcome-heading"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-8">
          <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group cursor-pointer hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-2xl transition-all duration-300"></div>
            <div className="flex flex-col items-center space-y-3">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                AI Avatar Coming Soon
              </p>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 
            id="welcome-heading"
            className="text-2xl sm:text-3xl font-bold text-gray-900"
          >
            Hello Creator!
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fear of publishing? Ready to make something amazing? I'm here to inspire, support, and celebrate your creative journey.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;