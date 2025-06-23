import React, { useState } from 'react';
import { Heart, Play, Pause, Volume2, MessageCircle } from 'lucide-react';
import AudioPlayer from '../AudioPlayer';
import type { ButtonState, MediaContent } from '../../types';
import axios from 'axios';
import {
  PICA_SECRET_KEY,
  PICA_GEMINI_KEY,
  PICA_ELEVENLABS_KEY,
  PICA_SUPPORT_MESSAGE_ACTION_ID,
  PICA_SUPPORT_AUDIO_ACTION_ID,
  ELEVENLABS_VOICE_ID,
} from '../../config/env';
import { MOTIVATIONAL_PHRASES_START, MOTIVATIONAL_PHRASES_MIDDLE, MOTIVATIONAL_PHRASES_END, getRandomElement } from '../../config/gemini_prompts';
import BlockHeader from './BlockHeader';
import BlockActionButton from './BlockActionButton';

const SupportBlock: React.FC = () => {
  const [state, setState] = useState<ButtonState>({ isLoading: false, isActive: false });
  const [isMediaPlaying, setIsMediaPlaying] = useState(false);

  // Browser-compatible function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): Promise<string> => {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer]);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const createSupportMessageAndAudio = async (): Promise<MediaContent> => {
    const dynamicPrompt = `
      Generate a short, motivational message for a content creator experiencing editing burnout.
      Start with "${getRandomElement(MOTIVATIONAL_PHRASES_START)}".
      Include the idea that "${getRandomElement(MOTIVATIONAL_PHRASES_MIDDLE)}".
      End with "${getRandomElement(MOTIVATIONAL_PHRASES_END)}".
      Keep the total message under 30 words. Focus on encouragement and the value of their work.
    `;
    try {
      const geminiRes = await axios.post(
        'https://api.picaos.com/v1/passthrough/models/gemini-1.5-flash:generateContent',
        {
          contents: [
            {
              parts: [
                { text: dynamicPrompt }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-pica-secret': PICA_SECRET_KEY,
            'x-pica-connection-key': PICA_GEMINI_KEY,
            'x-pica-action-id': PICA_SUPPORT_MESSAGE_ACTION_ID
          }
        }
      );

      const motivationalMessage = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '🛑 You are doing amazing work! Take a breath and remember why you started creating.';

      if (ELEVENLABS_VOICE_ID) {
        try {
          const elevenRes = await axios.post(
            `https://api.picaos.com/v1/passthrough/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`,
            {
              text: motivationalMessage
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-pica-secret': PICA_SECRET_KEY,
                'x-pica-connection-key': PICA_ELEVENLABS_KEY,
                'x-pica-action-id': PICA_SUPPORT_AUDIO_ACTION_ID
              },
              responseType: 'arraybuffer'
            }
          );

          const audioBase64 = await arrayBufferToBase64(elevenRes.data);
          return {
            type: 'audio',
            src: `data:audio/mpeg;base64,${audioBase64}`,
            title: 'Motivational Message',
            text: motivationalMessage
          };
        } catch (speechError) {
          return {
            type: 'text',
            title: 'Motivational Support 💪',
            text: motivationalMessage
          };
        }
      } else {
        return {
          type: 'text',
          title: 'Motivational Support 💪',
          text: motivationalMessage
        };
      }
    } catch (error) {
      return {
        type: 'text',
        title: 'Motivational Support 💪',
        text: '🛑 You are doing amazing work! Take a breath and remember why you started creating. Every edit brings you closer to your vision. Keep going!'
      };
    }
  };

  const handleClick = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    setIsMediaPlaying(false);
    try {
      const content = await createSupportMessageAndAudio();
      setState(prev => ({
        isLoading: false,
        isActive: !prev.isActive,
        content
      }));
    } catch {
      setState({ isLoading: false, isActive: false });
    }
  };

  const handleToggleMedia = () => {
    setIsMediaPlaying(prev => !prev);
  };

  const handleAudioEnded = () => {
    setIsMediaPlaying(false);
  };

  const textColor = 'text-purple-600';
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <BlockHeader
            icon={<Heart className="w-8 h-8 text-white" />}
            bgColor="bg-purple-500 hover:bg-purple-600"
            title="Burnout from video editing"
            description="Need encouragement? Get personalized motivation."
          />
          <BlockActionButton
            onClick={handleClick}
            isLoading={state.isLoading}
            label="Support Me"
            loadingLabel="Generating..."
            colorClass="bg-purple-500 hover:bg-purple-600 text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          />
        </div>
      </div>
      {/* Content Display */}
      {state.isActive && state.content && (
        <div 
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500 animate-fade-in"
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
                onClick={handleToggleMedia}
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
                    onEnded={handleAudioEnded}
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

export default SupportBlock;
