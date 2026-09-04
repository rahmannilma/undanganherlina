import React, { useState, useEffect, useRef } from 'react';

export default function BottomNavBar() {
  const [activeSection, setActiveSection] = useState('invite');
  const [isVisible, setIsVisible] = useState(false);
  const isClickingRef = useRef(false);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    const sections = [
      { id: 'invite', navId: 'invite' },
      { id: 'couple', navId: 'couple' },
      { id: 'bride', navId: 'couple' },
      { id: 'event', navId: 'event' },
      { id: 'gallery', navId: 'gallery' },
      { id: 'rsvp', navId: 'rsvp' },
      { id: 'gift', navId: 'gift' }
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Navbar hanya muncul setelah pengguna scroll ke bawah
      setIsVisible(scrollY > 200);

      // Jika baru saja diklik oleh user, hindari fluktuasi scroll listener
      if (isClickingRef.current) return;

      // Jika sudah berada di bagian paling bawah halaman, aktifkan item terakhir
      const isAtBottom =
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - 120;
      if (isAtBottom) {
        setActiveSection('gift');
        return;
      }

      // Gunakan garis trigger di 42% tinggi layar viewport
      const triggerY = window.innerHeight * 0.42;
      let currentNav = 'invite';

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        // Elemen aktif jika bagian atasnya telah mencapai atau melewati garis pandang (triggerY)
        // dan bagian bawahnya masih berada di area pandang layar
        if (rect.top <= triggerY && rect.bottom > 80) {
          currentNav = section.navId;
        }
      }

      setActiveSection(currentNav);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
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
    setActiveSection(id);
    isClickingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const targetEl = document.getElementById(id);
    if (id === 'invite') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickingRef.current = false;
    }, 800);
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
