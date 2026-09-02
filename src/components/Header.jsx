import React, { useState } from 'react';

export default function Header({ onMenuClick }) {
  const [liked, setLiked] = useState(false);

  return (
    <header className="bg-background/95 dark:bg-background/95 backdrop-blur-md border-b border-secondary/30 fixed top-0 w-full flex items-center justify-between px-6 h-16 z-50 transition-all duration-300">
      <button 
        onClick={onMenuClick}
        aria-label="Navigation Menu"
        className="text-secondary dark:text-secondary hover:text-tertiary transition-transform active:scale-90 p-2 -ml-2 rounded-full focus:outline-none"
      >
        <span className="material-symbols-outlined text-2xl">menu</span>
      </button>

      <div className="font-display-names text-display-names text-secondary text-[28px] sm:text-[32px] tracking-wide select-none">
        Royal Union
      </div>

      <button 
        onClick={() => setLiked(!liked)}
        aria-label="Send Love"
        className={`p-2 -mr-2 rounded-full transition-transform active:scale-125 focus:outline-none ${
          liked ? 'text-rose-500 animate-bounce' : 'text-secondary dark:text-secondary hover:text-tertiary'
        }`}
      >
        <span 
          className="material-symbols-outlined text-2xl" 
          style={{ fontVariationSettings: liked ? "'FILL' 1" : "'FILL' 0" }}
        >
          favorite
        </span>
      </button>
    </header>
  );
}
