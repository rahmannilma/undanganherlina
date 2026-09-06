import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function AudioPlayer({ autoPlayTrigger = false, showButton = true }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const hasPlayedRef = useRef(false);
  const START_SECONDS = 105; // 1 menit 45 detik (Reff / Bagian Utama)

  // Fungsi utama untuk memutar musik
  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const startPlayback = () => {
      try {
        if (audio.currentTime < 1) {
          audio.currentTime = START_SECONDS;
        }
      } catch (e) {
        // Abaikan jika browser belum membolehkan seek sebelum buffering
      }

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            hasPlayedRef.current = true;
            setIsPlaying(true);
          })
          .catch((err) => {
            // Autoplay diblokir oleh browser policy sampai ada interaksi user
            console.warn('Autoplay tertunda menunggu gestur pengguna:', err);
          });
      }
    };

    // Jika metadata sudah tersedia, langsung putar
    if (audio.readyState >= 1) {
      startPlayback();
    } else {
      const handleLoaded = () => {
        startPlayback();
        audio.removeEventListener('loadedmetadata', handleLoaded);
      };
      audio.addEventListener('loadedmetadata', handleLoaded, { once: true });
      audio.load();
    }
  }, []);

  // 1. Coba langsung putar musik seketika saat halaman/link pertama kali dibuka
  useEffect(() => {
    playMusic();

    // Dukungan untuk in-app browser (misal WeChat / beberapa webview)
    if (typeof window !== 'undefined' && window.WeixinJSBridge) {
      window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
        playMusic();
      });
    } else {
      document.addEventListener('WeixinJSBridgeReady', playMusic, { once: true });
    }
  }, [playMusic]);

  // 2. Trigger langsung dari window dan autoPlayTrigger
  useEffect(() => {
    window.__playWeddingMusic = playMusic;
    if (autoPlayTrigger) {
      playMusic();
    }
    return () => {
      delete window.__playWeddingMusic;
    };
  }, [autoPlayTrigger, playMusic]);

  // 3. Fallback: jika browser memblokir autoplay tanpa sentuhan, putar seketika saat ada interaksi pertama
  useEffect(() => {
    const handleFirstGesture = () => {
      if (!hasPlayedRef.current) {
        playMusic();
      }
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });

    return () => removeListeners();
  }, [playMusic]);

  // 4. Sinkronisasi event audio bawaan browser
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      // Loop kembali ke Reff (START_SECONDS) agar tetap syahdu
      audio.currentTime = START_SECONDS;
      audio.play().catch(() => {});
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (audio.currentTime < 1) {
        audio.currentTime = START_SECONDS;
      }
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  return (
    <>
      {/* Audio element dengan pre-buffering cepat */}
      <audio
        ref={audioRef}
        src="/bgm.mp3"
        loop
        preload="auto"
        playsInline
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
