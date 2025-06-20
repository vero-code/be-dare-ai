// src/config/env.ts

/**
 * Loading and basic checking of existence of environment variables.
 */
const getEnvVariable = (key: string, isOptional: boolean = false): string | undefined => {
  const value = import.meta.env[key];

  if (value === undefined || value === null || String(value).trim() === '') {
    if (!isOptional) {
      console.error(`Error: Environment variable ${key} is not defined or is empty.`);
    }
    return undefined;
  }

  const stringValue = String(value);

  if (key === 'VITE_ELEVENLABS_VOICE_ID') {
    if (stringValue === 'your_elevenlabs_voice_id_here' ||
        stringValue.includes('your_') ||
        stringValue.includes('_here')) {
      console.warn(`Warning: ElevenLabs Voice ID "${stringValue}" looks like a placeholder. Text-only fallback will be used.`);
      return undefined;
    }
  }

  return stringValue;
};

export const PICA_SECRET_KEY = getEnvVariable('VITE_PICA_SECRET_KEY');
export const PICA_GEMINI_KEY = getEnvVariable('VITE_PICA_GEMINI_CONNECTION_KEY');
export const PICA_ELEVENLABS_KEY = getEnvVariable('VITE_PICA_ELEVENLABS_CONNECTION_KEY');

export const PICA_IDEA_MESSAGE_ACTION_ID = getEnvVariable('VITE_PICA_IDEA_MESSAGE_ACTION_ID');
export const PICA_SUPPORT_MESSAGE_ACTION_ID = getEnvVariable('VITE_PICA_SUPPORT_MESSAGE_ACTION_ID');
export const PICA_SUPPORT_AUDIO_ACTION_ID = getEnvVariable('VITE_PICA_SUPPORT_AUDIO_ACTION_ID');
export const PICA_PUBLISHED_MESSAGE_ACTION_ID = getEnvVariable('VITE_PICA_PUBLISHED_MESSAGE_ACTION_ID');

export const ELEVENLABS_VOICE_ID = getEnvVariable('VITE_ELEVENLABS_VOICE_ID');

export const TAVUS_API_KEY = getEnvVariable('VITE_TAVUS_API_KEY');