"use client";
import { useState, useRef, useEffect } from "react";

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, autoPlay = true }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setCurrentTime(audioRef.current.currentTime);
      } else {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setIsLoaded(false); // Stop blinking when the button is clicked
    }
  };

  const startOver = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setIsLoaded(true); // Start blinking again
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsLoaded(false);
  };

  const handleLoaded = () => {
    setIsLoaded(true);
    if (autoPlay && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Handle autoplay failure
      });
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("loadeddata", handleLoaded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("loadeddata", handleLoaded);
      }
    };
  }, [autoPlay]);

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onEnded={handleEnded}
      />
      <button className={`player-button ${isPlaying ? "blinking" : ""}`} onClick={togglePlayPause}>
        <img src={isPlaying ? "/pause.svg" : "/play.svg"} alt={isPlaying ? "Pause" : "Play"} /> {/* Direct path from public folder */}
      </button>
      <button className="start-over-button" onClick={startOver}>
        <img src="/replay.svg" alt="Start Over" /> {/* Direct path from public folder */}
      </button>
    </div>
  );
};

export default AudioPlayer;
