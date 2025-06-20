import React, { useState } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import axios from 'axios';
import type { Challenge } from '../types';
import {
  PICA_SECRET_KEY,
  PICA_GEMINI_KEY,
  PICA_IDEA_MESSAGE_ACTION_ID,
} from '../config/env';

const ChallengeGenerator: React.FC = () => {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCreativeBlogIdea = async (): Promise<string> => {
    console.log('Click "idea" button');
    try {
      const response = await axios.post(
        'https://api.picaos.com/v1/passthrough/models/gemini-1.5-flash:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: 'You are a creative assistant for bloggers. Generate a single, fresh, inspiring, and original content idea or writing prompt for a blogger experiencing writer\'s block. The idea should be unique, actionable, and spark creativity. Respond with only the idea as a short string. Add a random twist or context to make it even more interesting.'
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-pica-secret': PICA_SECRET_KEY,
            'x-pica-connection-key': PICA_GEMINI_KEY,
            'x-pica-action-id': PICA_IDEA_MESSAGE_ACTION_ID
          }
        }
      );

      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '🛑 Create content about something that made you smile today';
    } catch (error) {
      console.error('Error fetching creative idea:', error);
      
      // Fallback ideas if API fails
      const fallbackIdeas = [
        '🛑 Write about a skill you learned by accident and how it changed your perspective',
        '🛑 Document the story behind your most treasured possession and why it matters',
        '🛑 Create content explaining your creative process using only food analogies',
        '🛑 Share three things you believed as a child that turned out to be hilariously wrong',
        '🛑 Write about a conversation that completely changed your mind about something important'
      ];
      
      return fallbackIdeas[Math.floor(Math.random() * fallbackIdeas.length)];
    }
  };

  const generateChallenge = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ideaText = await getCreativeBlogIdea();
      
      const newChallenge: Challenge = {
        id: Date.now().toString(),
        text: ideaText,
        category: 'AI Generated'
      };
      
      setCurrentChallenge(newChallenge);
    } catch (err) {
      setError('Failed to generate challenge. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section 
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      aria-labelledby="challenge-heading"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h3 
            id="challenge-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900 mb-4"
          >
            Creative Challenge Generator
          </h3>
          <p className="text-gray-600 mb-6">
            No ideas for content? Stuck on what to create? Let me inspire you with a personalized challenge!
          </p>
          
          <button
            onClick={generateChallenge}
            disabled={isLoading}
            className={`inline-flex items-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-200 ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-500 text-white hover:bg-indigo-600 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg'
            }`}
            aria-label={isLoading ? 'Generating challenge...' : 'Generate new creative challenge'}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5 mr-2" />
                I need an idea
              </>
            )}
          </button>
        </div>

        {error && (
          <div 
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {currentChallenge && (
          <div 
            className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 animate-fade-in"
            role="region"
            aria-live="polite"
            aria-labelledby="challenge-content"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {currentChallenge.category}
                  </span>
                </div>
                <p 
                  id="challenge-content"
                  className="text-lg text-gray-800 leading-relaxed"
                >
                  {currentChallenge.text}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChallengeGenerator;