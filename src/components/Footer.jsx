import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full text-center p-6 bg-black/35 backdrop-blur-xl rounded-3xl border border-secondary/40 shadow-2xl mb-24 md:mb-16 space-y-4">
      {/* Monogram */}
      <div className="flex items-center justify-center gap-3">
        <div className="h-px w-10 bg-secondary/40"></div>
        <div className="w-9 h-9 rounded-full border border-secondary/40 bg-secondary/10 flex items-center justify-center text-secondary font-display-names text-lg font-serif">
          A&amp;L
        </div>
        <div className="h-px w-10 bg-secondary/40"></div>
      </div>

      <div className="space-y-1">
        <h4 className="font-display-names text-xl text-secondary font-serif">
          Muhammad Arfan &amp; Herlina
        </h4>
        <p className="font-body-sm text-xs text-white/75 italic">
          Terima kasih atas doa &amp; restu Anda
        </p>
      </div>

      {/* Minimalist Nav Links */}
      <div className="flex justify-center flex-wrap gap-2 pt-1">
        {[
          { href: '#invite', label: 'Home' },
          { href: '#couple', label: 'Couple' },
          { href: '#event', label: 'Event' },
          { href: '#rsvp', label: 'RSVP' },
          { href: '#gift', label: 'Gift' }
        ].map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="px-3 py-1 rounded-full text-xs font-label-caps text-white/75 hover:text-secondary hover:bg-secondary/10 border border-transparent hover:border-secondary/30 transition-all duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <div className="pt-2 border-t border-secondary/20">
        <p className="font-label-caps text-[10px] text-white/50 tracking-wider uppercase">
          The Wedding Celebration &bull; 27.09.2026
        </p>
      </div>
    </footer>
  );
}
