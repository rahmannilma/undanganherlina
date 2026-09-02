import React from 'react';

export default function ClosingSection() {
  return (
    <section className="w-full text-center p-6 sm:p-7 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden">
      <div className="space-y-3 max-w-xs mx-auto">
        <h2 className="font-display-names text-[32px] sm:text-[36px] text-secondary mb-2">
          Thank You
        </h2>
        <p className="font-body-lg text-xs sm:text-[13px] text-inverse-surface opacity-90 leading-relaxed">
          Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
        </p>
        <div className="pt-3">
          <p className="font-label-caps text-xs text-secondary tracking-widest uppercase font-semibold">
            Muhammad Arfan &amp; Herlina
          </p>
        </div>
      </div>
    </section>
  );
}
