import React from 'react';

export default function QuoteSection() {
  return (
    <section className="w-full text-center p-6 sm:p-7 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden">
      <div className="space-y-4 max-w-xs mx-auto">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border border-secondary/40 flex items-center justify-center bg-secondary/5">
            <span 
              className="material-symbols-outlined text-secondary text-xl" 
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              favorite
            </span>
          </div>
        </div>

        <blockquote className="font-body-lg text-xs sm:text-[13px] text-inverse-surface italic opacity-90 leading-relaxed font-light">
          "And among His signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquility with them, and He has put love and mercy between your (hearts)."
        </blockquote>

        <p className="font-label-caps text-[11px] text-secondary tracking-widest font-semibold">
          (QS. Ar-Rum: 21)
        </p>
      </div>
    </section>
  );
}
