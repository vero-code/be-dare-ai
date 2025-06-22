import React, { useState, useRef } from 'react';
import { Heart, Smile, Trophy, Play, Pause, Volume2, MessageCircle } from 'lucide-react';
import axios from 'axios';
import type { ButtonState, MediaContent } from '../types';
import {
  PICA_SECRET_KEY,
  PICA_GEMINI_KEY,
  PICA_ELEVENLABS_KEY,
  PICA_SUPPORT_MESSAGE_ACTION_ID,
  PICA_SUPPORT_AUDIO_ACTION_ID,
  PICA_SMILE_MESSAGE_ACTION_ID,
  PICA_PUBLISHED_MESSAGE_ACTION_ID,
  ELEVENLABS_VOICE_ID,
  TAVUS_API_KEY,
  TAVUS_REPLICA_ID,
} from '../config/env';
import AudioPlayer from './AudioPlayer';
import { mockMediaContent } from '../config/mock';
import { MOTIVATIONAL_PHRASES_START, MOTIVATIONAL_PHRASES_MIDDLE, MOTIVATIONAL_PHRASES_END, getRandomElement } from '../config/gemini_prompts';

const ActionButtons: React.FC = () => {
  const [buttonStates, setButtonStates] = useState<Record<string, ButtonState>>({
    support: { isLoading: false, isActive: false },
    smile: { isLoading: false, isActive: false },
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

  // Browser-compatible function to convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): Promise<string> => {
    return new Promise((resolve, reject) => {
      const blob = new Blob([buffer]);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Extract base64 part from data URL (remove "data:application/octet-stream;base64,")
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Action of "Support Me" button
  const createSupportMessageAndAudio = async (): Promise<MediaContent> => {
    console.log('Click "support" button');
    const dynamicPrompt = `
      Generate a short, motivational message for a content creator experiencing editing burnout.
      Start with "${getRandomElement(MOTIVATIONAL_PHRASES_START)}".
      Include the idea that "${getRandomElement(MOTIVATIONAL_PHRASES_MIDDLE)}".
      End with "${getRandomElement(MOTIVATIONAL_PHRASES_END)}".
      Keep the total message under 30 words. Focus on encouragement and the value of their work.
    `;
    try {
      // 1. Generate motivational message
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

      // 2. Convert to speech only if we have a valid voice ID
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

          // Convert ArrayBuffer to Base64 using browser-compatible method
          const audioBase64 = await arrayBufferToBase64(elevenRes.data);
          
          return {
            type: 'audio',
            src: `data:audio/mpeg;base64,${audioBase64}`,
            title: 'Motivational Support Message',
            text: motivationalMessage
          };
        } catch (speechError) {
          console.error('Error generating speech:', speechError);
          
          // Fallback to text-only if speech generation fails
          return {
            type: 'text',
            title: 'Motivational Support 💪',
            text: motivationalMessage
          };
        }
      } else {
        // Return text-only content when voice ID is not configured
        console.warn('Voice ID not configured properly. Returning text-only content.');
        return {
          type: 'text',
          title: 'Motivational Support 💪',
          text: motivationalMessage
        };
      }
    } catch (error) {
      console.error('Error generating support message:', error);
      
      // Fallback message if everything fails
      return {
        type: 'text',
        title: 'Motivational Support 💪',
        text: '🛑 You are doing amazing work! Take a breath and remember why you started creating. Every edit brings you closer to your vision. Keep going!'
      };
    }
  };

  // Action of "Make Me Smile" button
  // 1. Generate joke text using Gemini
  const generateJokeText = async (): Promise<string> => {
    try {
      const response = await axios.post(
        'https://api.picaos.com/v1/passthrough/models/gemini-1.5-flash:generateContent',
        {
          contents: [
            {
              parts: [
                {
                  text: 'Generate a short, funny, clean joke or humorous observation that would make a content creator smile. The joke should be uplifting, creative, and suitable for all audiences. Keep it under 50 words and make it relatable to creators or everyday life. Be witty and original.'
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
            'x-pica-action-id': PICA_SMILE_MESSAGE_ACTION_ID
          }
        }
      );

      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '🛑 Why did the content creator break up with their camera? Because it kept focusing on other things!';
    } catch (error) {
      console.error('Error generating joke text:', error);
      
      // Fallback jokes if API fails
      const fallbackJokes = [
        '🛑 Why did the content creator break up with their camera? Because it kept focusing on other things!',
        '🛑 I told my computer a joke about algorithms... It didn\'t laugh, but it did process it!',
        '🛑 Why don\'t content creators ever get lost? Because they always know how to find their niche!',
        '🛑 What\'s a blogger\'s favorite type of music? Anything with good content!',
        '🛑 Why did the YouTuber go to therapy? They had too many unresolved issues with their subscribers!'
      ];
      
      return fallbackJokes[Math.floor(Math.random() * fallbackJokes.length)];
    }
  };

  // 2. Generate video joke using Tavus API
  const generateVideoJoke = async (): Promise<MediaContent> => {
    try {
      // const jokeText = await generateJokeText();
      let jokeText = "Hi! This is example a joke.";
      console.log("Generated joke text:", jokeText);

      if (!TAVUS_API_KEY || !TAVUS_REPLICA_ID) {
        console.warn('Tavus API or Replica ID not configured properly. Returning text-only joke.');
        return {
          type: 'text',
          title: '🛑 Here\'s a joke to brighten your day!',
          text: jokeText
        };
      }

      const requestBody = {
        replica_id: TAVUS_REPLICA_ID,
       script: jokeText,
        video_name: `Joke Video ${Date.now()}`,
      };

      console.log("Sending Tavus video creation request with body:", requestBody);

      // Create video using Tavus API
      const tavusResponse = await axios.post(
        'https://tavusapi.com/v2/videos',
        requestBody,
        {
          headers: {
            'x-api-key': TAVUS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      const videoId = tavusResponse.data.video_id;

      if (!videoId) {
        throw new Error('No video ID returned from Tavus API in the initial creation response.');
      }

      console.log(`Tavus video creation initiated. Video ID: ${videoId}`);

      // Poll for video completion (simplified polling)
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max wait time (30 attempts * 10 seconds)
      const pollInterval = 10000; // 10 seconds
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
        try {
          const statusResponse = await axios.get(
            'https://tavusapi.com/v2/videos/' + videoId,
            {
              headers: {
                'x-api-key': TAVUS_API_KEY
              }
            }
          );

          const status = statusResponse.data.status;
          console.log(`Polling status for video ${videoId}: ${status}`);
          
          if (status === 'completed') {
            const videoUrl = statusResponse.data.download_url || statusResponse.data.hosted_url;
            
            if (videoUrl) {
              console.log(`Video completed and URL found: ${videoUrl}`);
              return {
                type: 'video',
                src: videoUrl,
                title: 'AI Generated Video Joke 🎬',
                text: jokeText
              };
            } else {
              console.error('Video completed but no download_url or hosted_url found.');
              throw new Error('Video completed but URL not available.');
            }
          } else if (status === 'failed' || status === 'error') {
            console.error(`Video generation failed with status: ${status}. Error details:`, statusResponse.data.error); // Log error details if available
            throw new Error('Video generation failed');
          }
          
          attempts++;
        } catch (pollError) {
          console.error('Error polling video status:', pollError);
          attempts++;
        }
      }

      // If video generation takes too long, return text joke
      console.warn('Video generation timed out after multiple attempts. Returning text joke.');
      return {
        type: 'text',
        title: '🛑 Here\'s a joke while we work on the video!',
        text: jokeText + '\n\n(Video generation is taking longer than expected, but the joke is still good!)'
      };

    } catch (error) {
      console.error('Overall error generating video joke:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('Tavus API Error Response Data:', error.response.data);
        console.error('Tavus API Error Response Status:', error.response.status);
        console.error('Tavus API Error Response Headers:', error.response.headers);
      }
      
      // Fallback to text joke if video generation fails
      // const jokeTextFallback = await generateJokeText();
      const jokeTextFallback = "🛑 Hi! This is example a joke.";
      return {
        type: 'text',
        title: '🛑 Video Joke Failed!',
        text: `Oops! Couldn't generate a video joke right now. But here's a text one: "${jokeTextFallback}"`
      };
    }
  };

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

      if (buttonKey === 'support') {
        // Generate support message with text-to-speech
        content = await createSupportMessageAndAudio();
      } else if (buttonKey === 'smile') {
        // Generate video joke
        content = await generateVideoJoke();
      } else if (buttonKey === 'published') {
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
      key: 'support',
      title: 'Editing burnout',
      description: 'Need encouragement? Get personalized motivation.',
      icon: Heart,
      bgColor: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-indigo-600',
      buttonText: 'Support Me'
    },
    {
      key: 'smile',
      title: 'Comment stress',
      description: 'Feeling down? Let me brighten your day.',
      icon: Smile,
      bgColor: 'bg-purple-500 hover:bg-purple-600',
      textColor: 'text-purple-600',
      buttonText: 'Make Me Smile'
    },
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