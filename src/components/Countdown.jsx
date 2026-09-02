import React, { useState, useEffect } from 'react';

export default function Countdown({ 
  targetDate = '2026-09-27T09:00:00+07:00', 
  isRevealed = true,
  baseDelay = 5800
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const items = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto my-7">
      {items.map((item, idx) => (
        <div 
          key={idx} 
          className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-secondary/45 bg-surface-container/35 backdrop-blur-md shadow-md ${
            isRevealed ? 'animate-drop-bounce' : 'opacity-0 pointer-events-none'
          }`}
          style={{ 
            opacity: 0,
            animationDelay: `${baseDelay + idx * 180}ms`,
            animationFillMode: 'both'
          }}
        >
          <span className="font-headline-md text-secondary font-bold text-xl sm:text-2xl font-serif">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="font-label-caps text-[10px] sm:text-xs text-inverse-surface/80 uppercase tracking-wider mt-0.5">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
