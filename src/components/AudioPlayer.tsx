import React, { useRef, useEffect, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  onEnded?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isPlaying, onEnded }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && canPlay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Autoplay blocked:', err);
        });
      }
    }

    if (!isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isPlaying, canPlay, src]);

  // Reset canPlay flag when src changes
  useEffect(() => {
    setCanPlay(false);
  }, [src]);

  return (
    <audio
      ref={audioRef}
      src={src}
      controls
      style={{ width: '100%' }}
      onCanPlayThrough={() => setCanPlay(true)}
      onEnded={onEnded}
    >
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
