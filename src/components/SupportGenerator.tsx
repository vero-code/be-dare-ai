import React from 'react';
import { Heart, Play, Pause, Volume2, MessageCircle } from 'lucide-react';
import AudioPlayer from './AudioPlayer';
import type { ButtonState } from '../types';

interface SupportGeneratorProps {
  state: ButtonState;
  isMediaPlaying: boolean;
  onClick: () => void;
  onToggleMedia: () => void;
  onAudioEnded: () => void;
}

const SupportGenerator: React.FC<SupportGeneratorProps> = ({
  state,
  isMediaPlaying,
  onClick,
  onToggleMedia,
  onAudioEnded
}) => {
  const textColor = 'text-purple-600';
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-purple-500 hover:bg-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            Burnout from video editing
          </h4>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Need encouragement? Get personalized motivation.
          </p>
          <button
            onClick={onClick}
            disabled={state.isLoading}
            className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
              state.isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
            }`}
            aria-label={state.isLoading ? 'Loading support...' : 'Support Me'}
          >
            {state.isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </div>
            ) : (
              'Support Me'
            )}
          </button>
        </div>
      </div>
      {/* Content Display */}
      {state.isActive && state.content && (
        <div 
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-indigo-500 animate-slide-down"
          role="region"
          aria-label="Support content"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {state.content.type === 'text' ? (
                <MessageCircle className={`w-5 h-5 ${textColor}`} />
              ) : (
                <Volume2 className={`w-5 h-5 ${textColor}`} />
              )}
              <span className="font-medium text-gray-900">
                {state.content.title}
              </span>
            </div>
            {state.content.type !== 'text' && (
              <button
                onClick={onToggleMedia}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isMediaPlaying 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-indigo-100 text-purple-600 hover:bg-opacity-80'
                }`}
                aria-label={isMediaPlaying ? 'Pause media' : 'Play media'}
              >
                {isMediaPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            {state.content.type === 'text' ? (
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                  {state.content.text}
                </p>
              </div>
            ) : state.content.type === 'audio' ? (
              <div className="space-y-3">
                {state.content.text && (
                  <p className="text-sm text-gray-700 italic">
                    "{state.content.text}"
                  </p>
                )}
                {state.content.src && (
                  <AudioPlayer
                    src={state.content.src}
                    isPlaying={isMediaPlaying}
                    onEnded={onAudioEnded}
                  />
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportGenerator;
