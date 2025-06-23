import React, { useEffect, useState } from 'react';
import { Play } from 'lucide-react';
import axios from 'axios';
import {
  TAVUS_API_KEY,
  TAVUS_REPLICA_ID,
  TAVUS_PERSONA_ID
} from '../config/env';

const WelcomeSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationUrl, setConversationUrl] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const startConversation = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://tavusapi.com/v2/conversations',
        {
          replica_id: TAVUS_REPLICA_ID,
          persona_id: TAVUS_PERSONA_ID,
          conversation_name: 'Creator Support Session',
          custom_greeting: "Hey there! I'm here to help you today 💬",
        },
        {
          headers: {
            'x-api-key': TAVUS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      const { conversation_url, conversation_id } = response.data;
      if (!conversation_url) throw new Error('No conversation URL returned');

      setConversationUrl(conversation_url);
      setConversationId(conversation_id);
    } catch (err) {
      console.error('Failed to start conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const endConversation = async () => {
    if (!conversationId) return;
    try {
      await axios.post(
        `https://tavusapi.com/v2/conversations/${conversationId}/end`,
        {},
        {
          headers: {
            'x-api-key': TAVUS_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      setConversationUrl(null);
      setConversationId(null);
    } catch (err) {
      console.error('Failed to end conversation:', err);
    }
  };

  return (
    <section
      className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 text-center border-b border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Hello Creator!</h2>
          <p className="text-lg text-gray-600 mt-2">
            Start a real-time video chat with your AI companion. I'll listen, respond, and support you!
          </p>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {!conversationUrl && !isLoading && (
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-gray-600">Your AI avatar is ready</p>
                  <button
                    onClick={startConversation}
                    className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition"
                  >
                    Start Conversation
                  </button>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="aspect-video flex items-center justify-center bg-indigo-50">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Creating conversation...</p>
                </div>
              </div>
            )}

            {conversationUrl && (
              <iframe
                src={conversationUrl}
                allow="camera; microphone"
                allowFullScreen
                className="w-full aspect-video rounded-xl border border-gray-200"
                title="AI Conversation"
              />
            )}
          </div>
        </div>

        {conversationId && (
          <div className="text-center py-4">
            <button
              onClick={endConversation}
              className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              End Conversation
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default WelcomeSection;