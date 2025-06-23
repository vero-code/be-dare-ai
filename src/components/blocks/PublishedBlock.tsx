import React, { useState } from 'react';
import { Trophy, Volume2, MessageCircle } from 'lucide-react';
import type { ButtonState, MediaContent } from '../../types';
import axios from 'axios';
import {
  PICA_SECRET_KEY,
  PICA_GEMINI_KEY,
  PICA_PUBLISHED_MESSAGE_ACTION_ID,
} from '../../config/env';
import BlockHeader from './BlockHeader';
import BlockActionButton from './BlockActionButton';

const PROMPT_INSTRUCTIONS = [
  "Say something uplifting to a blogger who just published a new video.",
  "Send kind words to a content creator finishing a project.",
  "Cheer on a YouTuber who just shared something vulnerable.",
  "What would a kind coach say to a blogger hitting publish?",
  "Praise a blogger who feels nervous after publishing."
];

const PublishedBlock: React.FC = () => {
  const [state, setState] = useState<ButtonState>({ isLoading: false, isActive: false });

  const sendMotivationalMessage = async (): Promise<MediaContent> => {
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
      return {
        type: 'text',
        title: 'Congratulations! 🎉',
        text: '🛑 Amazing work! You\'ve just shared your creativity with the world. Every piece of content you publish is a step forward in your creative journey. Keep creating and keep being awesome!'
      };
    }
  };

  const handleClick = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const content = await sendMotivationalMessage();
      setState(prev => ({
        isLoading: false,
        isActive: !prev.isActive,
        content
      }));
    } catch {
      setState({ isLoading: false, isActive: false });
    }
  };

  const textColor = 'text-emerald-600';
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div className="text-center">
          <BlockHeader
            icon={<Trophy className="w-8 h-8 text-white" />}
            bgColor="bg-emerald-500 hover:bg-emerald-600"
            title="Post-publishing devastation"
            description="Celebrate your achievement with me!"
          />
          <BlockActionButton
          onClick={handleClick}
          isLoading={state.isLoading}
          label="I Published!"
          loadingLabel="Generating..."
          colorClass="bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
        />
        </div>
      </div>
      {/* Content Display */}
      {state.isActive && state.content && (
        <div 
          className="bg-white rounded-xl shadow-md p-4 border-l-4 border-emerald-500 animate-fade-in"
          role="region"
          aria-label="Published content"
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
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishedBlock;
