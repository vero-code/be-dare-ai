import React, { useState, useRef } from 'react';
import { Trophy, Play, Pause, Volume2, MessageCircle } from 'lucide-react';
import axios from 'axios';
import type { ButtonState, MediaContent } from '../types';
import {
  PICA_SECRET_KEY,
  PICA_GEMINI_KEY,
  PICA_PUBLISHED_MESSAGE_ACTION_ID,
} from '../config/env';
import AudioPlayer from './AudioPlayer';
import { mockMediaContent } from '../config/mock';
import ChallengeGenerator from './ChallengeGenerator';
import SupportGenerator from './SupportGenerator';

const ActionButtons: React.FC = () => {
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({
    published: { isLoading: false, isActive: false }
  });

  const [playingMedia, setPlayingMedia] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const PROMPT_INSTRUCTIONS = [
    "Say something uplifting to a blogger who just published a new video.",
    "Send kind words to a content creator finishing a project.",
    "Cheer on a YouTuber who just shared something vulnerable.",
    "What would a kind coach say to a blogger hitting publish?",
    "Praise a blogger who feels nervous after publishing."
  ];

  // Action of "I published!" button
  const sendMotivationalMessage = async (): Promise<MediaContent> => {
    console.log('Click "published" button');
    try {
      const selectedInstruction = PROMPT_INSTRUCTIONS[Math.floor(Math.random() * PROMPT_INSTRUCTIONS.length)];

      const prompt = `
        You are a kind motivational coach for content creators. A user has just published a new blog post or video.

        Instruction: ${selectedInstruction}

        Respond with a warm, short, kind, supportive, and encouraging motivational message. It should be tailored for someone who has just shared their work and needs affirmation. Return only the message as a plain text string.
        `;
      
      const response = await axios.post(
        `https://api.picaos.com/v1/passthrough/models/gemini-1.5-flash:generateContent`,
        {
          contents: [
            { parts: [{ text: prompt }] }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-pica-secret': PICA_SECRET_KEY,
            'x-pica-connection-key': PICA_GEMINI_KEY,
            'x-pica-action-id': PICA_PUBLISHED_MESSAGE_ACTION_ID
          }
        }
      );

      const message = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '🛑 You are amazing!';
      
      return {
        type: 'text',
        title: 'Congratulations! 🎉',
        text: message
      };
    } catch (error) {
      console.error('Error fetching motivational message:', error);
      
      // Fallback message if API fails
      return {
        type: 'text',
        title: 'Congratulations! 🎉',
        text: '🛑 Amazing work! You\'ve just shared your creativity with the world. Every piece of content you publish is a step forward in your creative journey. Keep creating and keep being awesome!'
      };
    }
  };

  const handleButtonClick = async (buttonKey: string) => {
    setButtonStates(prev => ({
      ...prev,
      [buttonKey]: { ...prev[buttonKey], isLoading: true }
    }));

    if (playingMedia) {
      setPlayingMedia(null);
    }
    
    const newButtonStates: Record<string, ButtonState> = {};
    for (const key in buttonStates) {
      newButtonStates[key] = {
        ...buttonStates[key],
        isActive: key === buttonKey ? !buttonStates[key].isActive : false,
        content: key === buttonKey ? buttonStates[key].content : undefined
      };
    }

    try {
      let content: MediaContent;

      if (buttonKey === 'published') {
        // Fetch dynamic motivational message for published button
        content = await sendMotivationalMessage();
      } else {
        // Use mock content for other buttons
        await new Promise(resolve => setTimeout(resolve, 1000));
        content = mockMediaContent[buttonKey];
      }

      setButtonStates(prev => ({
        ...newButtonStates,
        [buttonKey]: {
          isLoading: false,
          isActive: !prev[buttonKey].isActive,
          content: content
        }
      }));
    } catch (error) {
      console.error('Error handling button click:', error);
      
      setButtonStates(prev => ({
        ...prev,
        [buttonKey]: {
          isLoading: false,
          isActive: false,
          content: undefined
        }
      }));
    }
  };

  const toggleMedia = (mediaKey: string) => {
    setPlayingMedia(prev => (prev === mediaKey ? null : mediaKey));
  };

  // Handle audio events
  const handleAudioEnded = () => {
    setPlayingMedia(null);
  };

  const handleVideoEnded = () => {
    setPlayingMedia(null);
  };

  const handleVideoPause = () => {
    setPlayingMedia(null);
  };

  const handleVideoPlay = () => {
    setPlayingMedia('smile');
  };

  const buttons = [
    {
      key: 'published',
      title: 'Post-publishing devastation',
      description: 'Celebrate your achievement with me!',
      icon: Trophy,
      bgColor: 'bg-emerald-500 hover:bg-emerald-600',
      textColor: 'text-emerald-600',
      buttonText: 'I Published!'
    }
  ];

  return (
    <section 
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      aria-labelledby="actions-heading"
    >
      <div className="text-center mb-12">
        <h3 
          id="actions-heading"
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4"
        >
          How can I help you today?
        </h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose what you need right now. I'm here to support your creative journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="animate-slide-down">
          <ChallengeGenerator />
        </div>
        <SupportGenerator />
        {buttons.map((button) => {
          const { key, title, description, icon: Icon, bgColor, textColor, buttonText } = button;
          const state = buttonStates[key];
          const isMediaPlaying = playingMedia === key;

          return (
            <div key={key} className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${bgColor} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {title}
                  </h4>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {description}
                  </p>

                  <button
                    onClick={() => handleButtonClick(key)}
                    disabled={state.isLoading}
                    className={`w-full py-3 px-6 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                      state.isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : `${bgColor} text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg`
                    }`}
                    aria-label={state.isLoading ? `Loading ${title.toLowerCase()}...` : buttonText}
                  >
                    {state.isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading...
                      </div>
                    ) : (
                      buttonText
                    )}
                  </button>
                </div>
              </div>

              {/* Content Display */}
              {state.isActive && state.content && (
                <div 
                  className={`bg-white rounded-xl shadow-md p-4 border-l-4 border-${key === 'support' ? 'indigo' : key === 'smile' ? 'purple' : 'emerald'}-500 animate-slide-down`}
                  role="region"
                  aria-label={`${title} content`}
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
                        onClick={() => toggleMedia(key)}
                        className={`p-2 rounded-lg transition-colors duration-200 ${
                          isMediaPlaying 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : `bg-${key === 'support' ? 'indigo' : key === 'smile' ? 'purple' : 'emerald'}-100 ${textColor} hover:bg-opacity-80`
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
                        {key === 'support' && state.content.src && (
                          <AudioPlayer
                            src={state.content.src}
                            isPlaying={isMediaPlaying}
                            onEnded={handleAudioEnded}
                          />
                        )}
                      </div>
                    ) : state.content.type === 'video' ? (
                      <div className="space-y-3">
                        {state.content.text && (
                          <p className="text-sm text-gray-700 italic mb-3">
                            "{state.content.text}"
                          </p>
                        )}
                        <video 
                          ref={videoRef}
                          controls 
                          className="w-full rounded-lg"
                          onEnded={handleVideoEnded}
                          onPause={handleVideoPause}
                          onPlay={handleVideoPlay}
                        >
                          <source src={state.content.src} type="video/mp4" />
                          Your browser does not support the video element.
                        </video>
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Play className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Video Player</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActionButtons;