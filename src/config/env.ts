// src/config/env.ts

export const PICA_SECRET_KEY = import.meta.env.VITE_PICA_SECRET_KEY;
export const PICA_GEMINI_KEY = import.meta.env.VITE_PICA_GEMINI_CONNECTION_KEY;
export const PICA_ELEVENLABS_KEY = import.meta.env.VITE_PICA_ELEVENLABS_CONNECTION_KEY;

export const PICA_IDEA_MESSAGE_ACTION_ID = import.meta.env.VITE_PICA_IDEA_MESSAGE_ACTION_ID;
export const PICA_SUPPORT_MESSAGE_ACTION_ID = import.meta.env.VITE_PICA_SUPPORT_MESSAGE_ACTION_ID;
export const PICA_SUPPORT_AUDIO_ACTION_ID = import.meta.env.VITE_PICA_SUPPORT_AUDIO_ACTION_ID;
export const PICA_PUBLISHED_MESSAGE_ACTION_ID = import.meta.env.VITE_PICA_PUBLISHED_MESSAGE_ACTION_ID;

export const ELEVENLABS_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

export const TAVUS_API_KEY = import.meta.env.VITE_TAVUS_API_KEY;

// TODO: To add some validation or error handling here