import React, { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ autoPlayTrigger = false, showButton = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef(null);
  const audioRef = useRef(null);

  // YouTube Video ID: Bagas Ran - Cinta Terakhirku
  const YOUTUBE_VIDEO_ID = 'WaQlADLnTvE';
  const START_SECONDS = 105; // Tepat 1 menit 45 detik (1:45)

  const autoPlayTriggerRef = useRef(autoPlayTrigger);
  useEffect(() => {
    autoPlayTriggerRef.current = autoPlayTrigger;
  }, [autoPlayTrigger]);

  useEffect(() => {
    // Load YouTube IFrame Player API
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player('youtube-audio-frame', {
          height: '1',
          width: '1',
          videoId: YOUTUBE_VIDEO_ID,
          playerVars: {
            autoplay: autoPlayTrigger ? 1 : 0,
            controls: 0,
            start: START_SECONDS,
            loop: 1,
            playlist: YOUTUBE_VIDEO_ID,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin
          },
          events: {
            onReady: (event) => {
              setIsReady(true);
              event.target.seekTo(START_SECONDS, true);
              if (autoPlayTrigger || autoPlayTriggerRef.current) {
                event.target.playVideo();
                setIsPlaying(true);
              }
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                // Loop back to 1:45
                event.target.seekTo(START_SECONDS, true);
                event.target.playVideo();
              }
            },
            onError: (err) => {
              console.warn("YouTube Player error, using fallback audio:", err);
              if (audioRef.current && autoPlayTriggerRef.current) {
                audioRef.current.currentTime = START_SECONDS;
                audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
              }
            }
          }
        });
      } catch (e) {
        console.error("Error initializing YT player:", e);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (autoPlayTrigger) {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        try {
          playerRef.current.seekTo(START_SECONDS, true);
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch (e) {
          console.warn("Error playing video:", e);
        }
      } else if (audioRef.current) {
        audioRef.current.currentTime = START_SECONDS;
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  }, [autoPlayTrigger]);

  const togglePlay = () => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      const state = playerRef.current.getPlayerState();
      if (state === window.YT?.PlayerState?.PLAYING || isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        // Jika belum mulai atau posisi di bawah 1:45, mulai dari 1:45
        if (playerRef.current.getCurrentTime && playerRef.current.getCurrentTime() < START_SECONDS) {
          playerRef.current.seekTo(START_SECONDS, true);
        }
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } else if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  return (
    <>
      {/* Hidden YouTube Iframe Player (Always in DOM for instant ready) */}
      <div className="absolute opacity-0 pointer-events-none -z-50 overflow-hidden w-px h-px">
        <div id="youtube-audio-frame"></div>
      </div>

      {/* Audio element */}
      <audio 
        ref={audioRef} 
        src="/bgm.mp3" 
        loop 
        preload="auto" 
      />

      {/* Floating Rotating Disc Button */}
      {showButton && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-40 animate-fade-up">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause Music" : "Play Music"}
            className={`w-12 h-12 rounded-full border-2 border-secondary bg-background/90 backdrop-blur-md flex items-center justify-center text-secondary shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
              isPlaying ? 'animate-spin-slow ring-2 ring-secondary/50' : 'opacity-80'
            }`}
            style={{ animationDuration: '5s' }}
            title="Bagas Ran - Cinta Terakhirku (1:45)"
          >
            <span className="material-symbols-outlined text-2xl">
              {isPlaying ? 'music_note' : 'music_off'}
            </span>
          </button>
        </div>
      )}
    </>
  );
}


