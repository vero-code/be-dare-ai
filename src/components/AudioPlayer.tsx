import React, { useRef, useEffect } from 'react';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isPlaying, onPlay, onPause, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isPlaying, src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = src;
    }
  }, [src]);

  return (
    <audio
      ref={audioRef}
      src={src}
      controls
      style={{ width: '100%' }}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
    >
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
