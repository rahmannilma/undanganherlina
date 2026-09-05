import React from 'react';
import Countdown from './Countdown';

export default function Hero({ guestName, isRevealed = true }) {
  return (
    <section
      className="w-full text-center p-6 sm:p-8 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden"
    >
      {/* Corner Ornaments */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-secondary opacity-60 rounded-tl-lg"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-secondary opacity-60 rounded-tr-lg"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-secondary opacity-60 rounded-bl-lg"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-secondary opacity-60 rounded-br-lg"></div>

      {/* Invitation Content */}
      <div className="space-y-4 relative z-10 min-h-[380px] flex flex-col justify-center">
        {guestName && (
          <div
            className={`inline-block px-4 py-1 rounded-full border border-secondary/40 bg-secondary/15 backdrop-blur-sm mb-1 ${isRevealed ? 'animate-fade-up' : 'opacity-0'
              }`}
            style={{ opacity: 0, animationDelay: '150ms', animationFillMode: 'both' }}
          >
            <p className="font-label-caps text-[11px] text-inverse-surface/90">
              Kepada Yth: <span className="font-semibold text-secondary">{guestName}</span>
            </p>
          </div>
        )}

        <p
          className={`font-label-caps text-[11px] text-inverse-surface uppercase tracking-[0.25em] font-medium ${isRevealed ? 'animate-fade-up' : 'opacity-0'
            }`}
          style={{ opacity: 0, animationDelay: '250ms', animationFillMode: 'both' }}
        >
          The Wedding Of
        </p>

        {/* Names entering alternately in Elegant Cursive Script (Great Vibes) */}
        <div className="font-script leading-tight my-2 tracking-wide">
          {/* Groom Name (Slide in slowly from Left) */}
          <div
            className={`text-[36px] sm:text-[44px] text-[#7A5816] font-normal ${isRevealed ? 'animate-slide-left' : 'opacity-0'
              }`}
            style={{ opacity: 0, animationDelay: '450ms', animationFillMode: 'both' }}
          >
            Muhammad Arfan
          </div>

          {/* Ampersand & (Pop in slowly at Center) */}
          <div
            className={`text-2xl sm:text-3xl font-serif my-0.5 text-[#8E691A] font-semibold inline-block ${isRevealed ? 'animate-pop-amp' : 'opacity-0'
              }`}
            style={{ opacity: 0, animationDelay: '700ms', animationFillMode: 'both' }}
          >
            &amp;
          </div>

          {/* Bride Name (Slide in slowly from Right) */}
          <div
            className={`text-[38px] sm:text-[46px] text-[#7A5816] font-normal ${isRevealed ? 'animate-slide-right' : 'opacity-0'
              }`}
            style={{ opacity: 0, animationDelay: '900ms', animationFillMode: 'both' }}
          >
            Herlina
          </div>
        </div>

        <div
          className={`flex items-center justify-center gap-3 py-1 ${isRevealed ? 'animate-fade-up' : 'opacity-0'
            }`}
          style={{ opacity: 0, animationDelay: '1150ms', animationFillMode: 'both' }}
        >
          <div className="h-px w-8 bg-secondary opacity-60"></div>
          <p className="font-body-lg text-sm sm:text-base text-inverse-surface font-medium tracking-wider">
            Sunday, 27.09.2026
          </p>
          <div className="h-px w-8 bg-secondary opacity-60"></div>
        </div>

        {/* Live Countdown Timer (Setiap kotak Hari, Jam, Menit, Detik jatuh perlahan bergantian) */}
        <Countdown targetDate="2026-09-27T09:00:00" isRevealed={isRevealed} baseDelay={1350} />

        {/* Save The Date Button (Muncul perlahan dan elegan di akhir urutan) */}
        <div
          className={`pt-2 ${isRevealed ? 'animate-fade-up' : 'opacity-0'
            }`}
          style={{ opacity: 0, animationDelay: '2000ms', animationFillMode: 'both' }}
        >
          <a
            href="#event"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-secondary bg-secondary text-primary-container font-label-caps text-[11px] uppercase tracking-widest hover:bg-transparent hover:text-secondary transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            Save The Date
          </a>
        </div>
      </div>
    </section>
  );
}
