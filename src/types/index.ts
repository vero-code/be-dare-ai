export interface Challenge {
  id: string;
  text: string;
  category: string;
}

export interface AudioVideoContent {
  type: 'audio' | 'video';
  src: string;
  title: string;
  text?: string; // Optional text content for audio messages
}

export interface TextContent {
  type: 'text';
  title: string;
  text: string;
}

export type MediaContent = AudioVideoContent | TextContent;

export interface ButtonState {
  isLoading: boolean;
  isActive: boolean;
  content?: MediaContent;
}