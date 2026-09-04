import React, { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ autoPlayTrigger = false, showButton = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const START_SECONDS = 105; // 1 menit 45 detik

  // Fungsi untuk memulai musik (digunakan oleh autoPlay dan interaksi user pertama)
  const startMusic = () => {
    if (hasPlayedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    hasPlayedRef.current = true;
    audio.currentTime = START_SECONDS;
    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Jika autoplay diblokir, tunggu interaksi user
        hasPlayedRef.current = false;
      });
  };

  // Coba autoplay langsung saat komponen mount (berfungsi di beberapa browser)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = START_SECONDS;
    audio.play()
      .then(() => {
        hasPlayedRef.current = true;
        setIsPlaying(true);
      })
      .catch(() => {
        // Browser memblokir autoplay tanpa interaksi — pasang listener
        hasPlayedRef.current = false;
      });
  }, []);

  // Backup: mainkan musik saat interaksi pertama user di halaman mana pun
  useEffect(() => {
    const handleFirstInteraction = () => {
      startMusic();
      // Hapus listener setelah berhasil
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true, passive: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (!hasPlayedRef.current) {
        audio.currentTime = START_SECONDS;
        hasPlayedRef.current = true;
      }
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  return (
    <>
      {/* Audio element - gunakan file lokal agar lebih cepat & tidak bergantung koneksi YouTube */}
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
            aria-label={isPlaying ? 'Pause Music' : 'Play Music'}
            className={`w-12 h-12 rounded-full border-2 border-secondary bg-background/90 backdrop-blur-md flex items-center justify-center text-secondary shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 ${
              isPlaying ? 'animate-spin-slow ring-2 ring-secondary/50' : 'opacity-80'
            }`}
            style={{ animationDuration: '5s' }}
            title="Bagas Ran - Cinta Terakhirku"
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
