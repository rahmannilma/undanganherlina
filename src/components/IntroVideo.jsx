import React, { useRef, useEffect, useState } from 'react';

export default function IntroVideo({ isPlaying, onTransitionOut, onFinished }) {
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  const DURATION_LIMIT = 9; // Tepat 9 detik

  useEffect(() => {
    if (isPlaying) {
      setIsVisible(true);
      setIsFadingOut(false);
      setProgress(0);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.log("Intro video auto-play prevented:", err);
        });
      }

      // Progress bar interval and timer for 9 seconds
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const pct = Math.min((elapsed / DURATION_LIMIT) * 100, 100);
        setProgress(pct);

        if (elapsed >= DURATION_LIMIT) {
          clearInterval(interval);
          handleComplete();
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
      setIsFadingOut(false);
      setProgress(0);
    }
  }, [isPlaying]);

  const handleComplete = () => {
    if (isFadingOut) return;
    setIsFadingOut(true);

    // Langsung mulai transisi muncul bg2 dan kartu agar efek crossfade mulus
    if (onTransitionOut) {
      onTransitionOut();
    }

    setTimeout(() => {
      if (onFinished) onFinished();
    }, 1800);
  };

  if (!isPlaying) return null;

  return (
    <div 
      className={`fixed inset-0 z-40 bg-black overflow-hidden flex items-center justify-center transition-all duration-[1800ms] ease-cinematic will-change-[opacity,transform,filter] ${
        isVisible && !isFadingOut 
          ? 'opacity-100 scale-100 filter-none' 
          : 'opacity-0 scale-[1.03] filter blur-[3px] pointer-events-none'
      }`}
    >
      {/* Fullscreen Video bg1 (Fills 100% of the entire screen frame completely) */}
      <video
        ref={videoRef}
        src="/bg1.mp4"
        playsInline
        muted={false}
        onEnded={handleComplete}
        className="w-full h-full min-w-full min-h-full object-cover select-none"
      />

      {/* Skip Button */}
      <button
        onClick={handleComplete}
        className={`absolute bottom-8 right-6 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-secondary/60 text-secondary text-xs uppercase tracking-widest font-label-caps transition-all duration-700 shadow-xl hover:scale-105 active:scale-95 ${
          isVisible && !isFadingOut ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <span>Lewati</span>
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </button>

      {/* Progress Bar (9 detik) */}
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-white/20 z-50 transition-opacity duration-700 ${isVisible && !isFadingOut ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="h-full bg-secondary transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

