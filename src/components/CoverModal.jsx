import React, { useState } from 'react';
import confetti from 'canvas-confetti';

export default function CoverModal({ isOpen, onClose, onStartIntro, guestName }) {
  const [isOpening, setIsOpening] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  if (!isOpen || isClosed) return null;

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);

    const goldPalette = ['#D4AF37', '#FFDF73', '#F3E5AB', '#FAF0E6', '#ECC440', '#FFE4B5'];

    // Slow-motion, graceful floating confetti
    try {
      // Center gentle upward burst
      confetti({
        particleCount: 50,
        spread: 90,
        origin: { y: 0.55, x: 0.5 },
        colors: goldPalette,
        startVelocity: 20,
        gravity: 0.35,
        decay: 0.94,
        ticks: 350,
        scalar: 1.05,
        disableForReducedMotion: true
      });

      // Left gentle floating fountain
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 60,
          origin: { x: 0.15, y: 0.65 },
          colors: goldPalette,
          startVelocity: 18,
          gravity: 0.35,
          decay: 0.94,
          ticks: 350,
          scalar: 0.9
        });
      }, 150);

      // Right gentle floating fountain
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 60,
          origin: { x: 0.85, y: 0.65 },
          colors: goldPalette,
          startVelocity: 18,
          gravity: 0.35,
          decay: 0.94,
          ticks: 350,
          scalar: 0.9
        });
      }, 250);
    } catch (e) {
      console.log(e);
    }

    // Start intro video immediately so bg1 is playing underneath the fading cover
    if (onStartIntro) {
      onStartIntro();
    }

    // Unmount modal after fade out animation completes
    setTimeout(() => {
      setIsClosed(true);
      if (onClose) onClose();
    }, 1000);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black px-6 transition-opacity duration-1000 ease-smooth-out will-change-[opacity] ${isOpening
        ? 'opacity-0 pointer-events-none'
        : 'opacity-100'
        }`}
    >
      {/* Fullscreen Background Image sampul.webp */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/sampul.webp"
          alt="Sampul Undangan"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover object-center select-none"
        />
        {/* Dark contrast tint for readability */}
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px]"></div>
      </div>

      {/* Gold Paper Texture */}
      <div className="absolute inset-0 texture-overlay mix-blend-overlay pointer-events-none z-0 opacity-25"></div>

      {/* Decorative Golden Ornaments */}
      <div
        className={`absolute top-8 left-8 w-12 sm:w-14 h-12 sm:h-14 border-t-2 border-l-2 border-secondary opacity-60 rounded-tl-xl transition-opacity duration-700 ${isOpening ? 'opacity-0' : 'opacity-60'
          }`}
      />
      <div
        className={`absolute top-8 right-8 w-12 sm:w-14 h-12 sm:h-14 border-t-2 border-r-2 border-secondary opacity-60 rounded-tr-xl transition-opacity duration-700 ${isOpening ? 'opacity-0' : 'opacity-60'
          }`}
      />
      <div
        className={`absolute bottom-8 left-8 w-12 sm:w-14 h-12 sm:h-14 border-b-2 border-l-2 border-secondary opacity-60 rounded-bl-xl transition-opacity duration-700 ${isOpening ? 'opacity-0' : 'opacity-60'
          }`}
      />
      <div
        className={`absolute bottom-8 right-8 w-12 sm:w-14 h-12 sm:h-14 border-b-2 border-r-2 border-secondary opacity-60 rounded-br-xl transition-opacity duration-700 ${isOpening ? 'opacity-0' : 'opacity-60'
          }`}
      />

      {/* Main Cover Content (Clean & Cardless) */}
      <div
        className={`max-w-[360px] sm:max-w-[420px] w-full text-center space-y-6 z-10 px-4 transition-all duration-1000 ease-smooth-out transform will-change-[opacity,transform] ${isOpening
          ? 'opacity-0 scale-[1.03] filter blur-[2px]'
          : 'opacity-100 scale-100 animate-float'
          }`}
      >
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-secondary/60 flex items-center justify-center bg-secondary/15 backdrop-blur-sm shadow-lg">
            <span
              className="material-symbols-outlined text-secondary text-2xl transition-transform duration-700 drop-shadow-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
        </div>

        <p className="font-label-caps text-xs text-white uppercase tracking-[0.28em] font-medium [text-shadow:_0_2px_8px_rgba(0,0,0,0.9)]">
          The Wedding Celebration
        </p>

        <h1 className="font-display-names text-[36px] sm:text-[44px] text-secondary leading-tight font-serif [text-shadow:_0_3px_14px_rgba(0,0,0,0.95),_0_6px_28px_rgba(0,0,0,0.85)]">
          <span className="block">Arfan</span>
          <span className="block text-2xl sm:text-3xl font-serif text-tertiary my-1 [text-shadow:_0_2px_10px_rgba(0,0,0,0.95)]">&amp;</span>
          <span className="block">Herlina</span>
        </h1>

        <div className="my-4 py-2 space-y-1">
          <p className="font-body-sm text-[12px] text-white/90 tracking-widest uppercase [text-shadow:_0_2px_8px_rgba(0,0,0,0.9)]">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </p>
          <div className="font-headline-md text-secondary text-lg sm:text-xl font-semibold tracking-wider [text-shadow:_0_2px_12px_rgba(0,0,0,0.95)]">
            {guestName || 'Tamu Undangan'}
          </div>
        </div>


        <div className="pt-4 flex justify-center">
          <button
            onClick={handleOpenClick}
            disabled={isOpening}
            aria-label="Buka Undangan"
            title="Buka Undangan"
            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-secondary bg-secondary text-primary-container flex items-center justify-center transition-all duration-500 shadow-2xl group ${isOpening
              ? 'scale-90 opacity-80 shadow-none'
              : 'hover:bg-transparent hover:text-secondary hover:shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:scale-110 active:scale-95'
              }`}
          >
            <span
              className={`material-symbols-outlined text-2xl sm:text-3xl transition-transform duration-700 ${
                isOpening ? 'rotate-180 scale-90' : 'group-hover:scale-110'
              }`}
            >
              {isOpening ? 'hourglass_top' : 'mail'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
