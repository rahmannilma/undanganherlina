import React, { useState, useEffect } from 'react';

export default function BottomNavBar() {
  const [activeSection, setActiveSection] = useState('invite');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Navbar hanya muncul setelah pengguna scroll ke bawah (melewati bagian atas Hero)
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 280);

      const sections = ['invite', 'couple', 'bride', 'event', 'gallery', 'rsvp', 'gift'];
      const scrollPosition = scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(sections[i] === 'bride' ? 'couple' : sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Panggil sekali untuk inisialisasi awal
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'invite', label: 'Home', icon: 'home' },
    { id: 'couple', label: 'Mempelai', icon: 'favorite' },
    { id: 'event', label: 'Acara', icon: 'event' },
    { id: 'gallery', label: 'Galeri', icon: 'photo_library' },
    { id: 'rsvp', label: 'RSVP', icon: 'mark_email_read' },
    { id: 'gift', label: 'Hadiah', icon: 'featured_seasonal_and_gifts' }
  ];

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const targetEl = document.getElementById(id);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={`fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-smooth-out will-change-[transform,opacity] ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-24 opacity-0 scale-90 pointer-events-none'
      }`}
    >
      <nav 
        aria-label="Bottom Navigation"
        className="w-max max-w-[94vw] bg-black/75 backdrop-blur-2xl border border-secondary/50 rounded-full px-2 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8),_0_0_20px_rgba(212,175,55,0.25)] ring-1 ring-white/10 flex items-center justify-center gap-1 sm:gap-2"
      >
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => handleNavClick(e, item.id)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center px-3 sm:px-3.5 py-1.5 rounded-full transition-all duration-300 group ${
                isActive
                  ? 'bg-secondary text-primary-container shadow-[0_2px_12px_rgba(212,175,55,0.5)] scale-105 font-semibold'
                  : 'text-white/70 hover:text-secondary hover:bg-white/10 active:scale-95'
              }`}
            >
              <span 
                className="material-symbols-outlined text-lg sm:text-xl transition-transform duration-300 group-hover:scale-110" 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-[9px] sm:text-[10px] mt-0.5 uppercase tracking-wider leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
