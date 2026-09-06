import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import QuoteSection from './components/QuoteSection';
import { GroomSection, BrideSection } from './components/CoupleSection';
import EventDetails from './components/EventDetails';
import RsvpSection from './components/RsvpSection';
import GiftSection from './components/GiftSection';
import ClosingSection from './components/ClosingSection';
import GallerySection from './components/GallerySection';
import BottomNavBar from './components/BottomNavBar';
import AudioPlayer from './components/AudioPlayer';
import CoverModal from './components/CoverModal';
import ScrollReveal from './components/ScrollReveal';

export default function App() {
  const [guestName, setGuestName] = useState('');
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [isHeroCardVisible, setIsHeroCardVisible] = useState(false);
  const [isInvitationRevealed, setIsInvitationRevealed] = useState(false);
  const [isBg2Active, setIsBg2Active] = useState(false);
  const [isAudioAutoPlay, setIsAudioAutoPlay] = useState(false);

  // Single video untuk bg1 (lebih ringan dari dual layer)
  const bg1Ref = useRef(null);
  const bg2Ref = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    // Ambil parameter nama tamu dari URL (baik dari ?to=... maupun #?...), mendukung berbagai nama parameter
    const extractGuestName = () => {
      const searchStr = window.location.search || '';
      const hashStr = window.location.hash.includes('?') ? window.location.hash.slice(window.location.hash.indexOf('?') + 1) : '';

      const searchParams = new URLSearchParams(searchStr);
      const hashParams = new URLSearchParams(hashStr);

      const possibleKeys = ['to', 'nama', 'name', 'tamu', 'kepada', 'kpd', 'guest', 'dear', 'u'];
      let foundValue = null;

      for (const k of possibleKeys) {
        foundValue = searchParams.get(k) || hashParams.get(k);
        if (foundValue) break;
      }

      // Jika belum ketemu, telusuri semua entri parameter tanpa case-sensitive
      if (!foundValue) {
        for (const [k, v] of [...searchParams.entries(), ...hashParams.entries()]) {
          if (possibleKeys.includes(k.trim().toLowerCase()) && v) {
            foundValue = v;
            break;
          }
        }
      }

      if (foundValue) {
        try {
          const decoded = decodeURIComponent(foundValue.replace(/\+/g, ' ')).replace(/_/g, ' ').trim();
          const formatted = decoded
            .split(' ')
            .filter(Boolean)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          return formatted || decoded;
        } catch {
          return foundValue.replace(/\+/g, ' ').replace(/_/g, ' ').trim();
        }
      }
      return '';
    };

    const detected = extractGuestName();
    if (detected) {
      setGuestName(detected);
    }
  }, []);

  useEffect(() => {
    if (isCoverOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCoverOpen]);

  // Aktifkan bg2 hanya saat Hero section scroll keluar layar, dan pause bg1 untuk hemat GPU
  useEffect(() => {
    if (!heroSectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Hero sudah tidak terlihat → pause bg1 & aktifkan bg2
          if (bg1Ref.current && !bg1Ref.current.paused) {
            bg1Ref.current.pause();
          }
          setIsBg2Active(true);
          if (bg2Ref.current && bg2Ref.current.paused) {
            bg2Ref.current.play().catch(() => {});
          }
        } else {
          // Hero kembali terlihat → resume bg1 & pause bg2 untuk hemat GPU
          if (bg1Ref.current && bg1Ref.current.paused && isInvitationRevealed) {
            bg1Ref.current.play().catch(() => {});
          }
          setIsBg2Active(false);
          if (bg2Ref.current && !bg2Ref.current.paused) {
            bg2Ref.current.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(heroSectionRef.current);
    return () => observer.disconnect();
  }, [isInvitationRevealed]);

  const handleStartIntro = () => {
    // Pastikan musik langsung bunyi seketika tombol ditekan jika sebelumnya belum sempat terputar
    setIsAudioAutoPlay(true);

    // Pastikan video bg1 mulai berputar
    if (bg1Ref.current) {
      bg1Ref.current.currentTime = 0;
      bg1Ref.current.play().catch(() => {});
    }

    // Tepat di detik ke-4: tampilkan Card Hero
    setTimeout(() => {
      setIsHeroCardVisible(true);
      setIsInvitationRevealed(true);
    }, 4000);
  };

  const handleCloseCover = () => {
    setIsCoverOpen(false);
  };

  // AudioPlayer selalu tampil agar musik bisa langsung play saat link dibuka
  return (
    <div className="text-inverse-surface relative min-h-screen selection:bg-secondary selection:text-primary-container bg-black">
      {/* Fixed Fullscreen Background Video bg2 (Latar belakang tetap untuk seluruh bagian konten di bawah Hero) */}
      {/* Diaktifkan oleh IntersectionObserver saat Hero scroll keluar layar */}
      <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black transition-opacity duration-700 ${isBg2Active ? 'opacity-100' : 'opacity-0'}`}>
        <video
          ref={bg2Ref}
          src="/bg2.mp4"
          loop
          muted
          playsInline
          preload="none"
          className="w-full h-full object-cover object-top select-none"
        />
        {/* Soft Contrast Tint */}
        <div className="absolute inset-0 bg-black/35"></div>
        {/* Soft Gold Paper Texture */}
        <div className="absolute inset-0 texture-overlay mix-blend-overlay opacity-15"></div>
      </div>

      {/* Opening Cover Modal */}
      <CoverModal
        isOpen={isCoverOpen}
        onStartIntro={handleStartIntro}
        onClose={handleCloseCover}
        guestName={guestName}
      />

      {/* SECTION 1: FULLSCREEN HERO / INTRO SECTION */}
      <section 
        ref={heroSectionRef}
        className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 overflow-hidden snap-card bg-black shadow-2xl"
        id="invite"
      >
        {/* Fullscreen Single Video bg1 */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          <video
            ref={bg1Ref}
            src="/bg1.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Dark Contrast Tint */}
          <div className="absolute inset-0 bg-black/40"></div>
          {/* Paper Texture */}
          <div className="absolute inset-0 texture-overlay mix-blend-overlay opacity-20"></div>
        </div>

        {/* Hero Card - Muncul pada detik ke-4 video intro */}
        <div 
          className={`relative z-10 w-full max-w-[350px] sm:max-w-[390px] mx-auto transition-all duration-[1400ms] ease-smooth-out transform will-change-[opacity,transform] ${
            isHeroCardVisible
              ? 'opacity-100 scale-100 translate-y-0 filter-none'
              : 'opacity-0 scale-90 translate-y-10 filter blur-[4px] pointer-events-none'
          }`}
        >
          <Hero guestName={guestName} isRevealed={isHeroCardVisible} />
        </div>

        {/* Scroll Down Indicator */}
        <div 
          className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-secondary/75 flex flex-col items-center gap-1 transition-all duration-1000 ${
            isHeroCardVisible ? 'opacity-100 translate-y-0 animate-bounce' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <span className="font-label-caps text-[10px] tracking-widest uppercase text-white/75 drop-shadow-sm">Scroll</span>
          <span className="material-symbols-outlined text-lg drop-shadow-sm">keyboard_double_arrow_down</span>
        </div>
      </section>

      {/* SECTION 2 & ONWARDS: MAIN CONTENT (Menggunakan video bg2.mp4 yang fixed di belakangnya) */}
      <div className="relative z-10 w-full overflow-hidden px-4 sm:px-6 pt-16 sm:pt-20 pb-32 sm:pb-40">
        {/* Divided Floating Cards Container */}
        <main className="relative z-10 w-full max-w-[350px] sm:max-w-[390px] mx-auto space-y-12 sm:space-y-16">
          <ScrollReveal className="snap-card" delay={100}>
            <QuoteSection />
          </ScrollReveal>

          <ScrollReveal className="snap-card" delay={100}>
            <GroomSection />
          </ScrollReveal>

          <ScrollReveal className="snap-card" delay={100}>
            <BrideSection />
          </ScrollReveal>

          <ScrollReveal className="snap-card" delay={100}>
            <EventDetails />
          </ScrollReveal>

          <ScrollReveal className="snap-card" delay={100}>
            <GallerySection />
          </ScrollReveal>

          <ScrollReveal className="snap-card" delay={100}>
            <RsvpSection defaultGuestName={guestName} />
          </ScrollReveal>

          <ScrollReveal className="snap-card" delay={100}>
            <GiftSection />
          </ScrollReveal>

          <ScrollReveal className="snap-card" delay={100}>
            <ClosingSection />
          </ScrollReveal>
        </main>
      </div>

      {/* Bottom Nav Bar - Mobile (Tampil setelah card hero terbuka) */}
      {isInvitationRevealed && <BottomNavBar />}

      {/* Floating Audio Player - selalu di DOM, musik langsung bunyi saat halaman dibuka */}
      <AudioPlayer autoPlayTrigger={isAudioAutoPlay} showButton={isInvitationRevealed || isHeroCardVisible} />
    </div>
  );
}
