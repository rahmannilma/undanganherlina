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
  const [isAudioAutoPlay, setIsAudioAutoPlay] = useState(false);

  // Dual Video Layer untuk Seamless Smooth Crossfade Loop (5s - 9s)
  const [activeBg1Layer, setActiveBg1Layer] = useState('A');
  const bg1ARef = useRef(null);
  const bg1BRef = useRef(null);
  const isCrossfadingRef = useRef(false);

  const bg2Ref = useRef(null);

  useEffect(() => {
    // Read guest name from query parameters e.g., ?to=Nama+Tamu or ?name=Nama+Tamu
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to') || params.get('name') || params.get('u');
    if (toParam) {
      setGuestName(decodeURIComponent(toParam));
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

  // Transisi Crossfade yang sangat halus di detik 8.2s menuju detik 5.0s
  const handleBg1TimeUpdate = (layer) => {
    if (layer !== activeBg1Layer) return;

    const currentVideo = layer === 'A' ? bg1ARef.current : bg1BRef.current;
    const nextVideo = layer === 'A' ? bg1BRef.current : bg1ARef.current;

    if (!currentVideo || isCrossfadingRef.current) return;

    if (currentVideo.currentTime >= 8.2) {
      isCrossfadingRef.current = true;
      if (nextVideo) {
        nextVideo.currentTime = 5.0;
        nextVideo.play().catch(() => {});
      }
      setActiveBg1Layer(layer === 'A' ? 'B' : 'A');

      setTimeout(() => {
        isCrossfadingRef.current = false;
      }, 1200);
    }
  };

  const handleStartIntro = () => {
    // Musik langsung berputar seketika tombol Buka Undangan ditekan
    setIsAudioAutoPlay(true);

    // Memastikan video Layer A mulai berputar dari awal
    if (bg1ARef.current) {
      bg1ARef.current.currentTime = 0;
      bg1ARef.current.play().catch(() => {});
    }
    setActiveBg1Layer('A');

    if (bg2Ref.current) {
      bg2Ref.current.play().catch(() => {});
    }

    // Tepat di detik ke-4: tampilkan Card Hero (video bg1 tetap lanjut bermain halus)
    setTimeout(() => {
      setIsHeroCardVisible(true);
      setIsInvitationRevealed(true);
    }, 4000);
  };

  const handleCloseCover = () => {
    setIsCoverOpen(false);
  };

  return (
    <div className="text-inverse-surface relative min-h-screen selection:bg-secondary selection:text-primary-container bg-black">
      {/* Fixed Fullscreen Background Video bg2 (Latar belakang tetap untuk seluruh bagian konten di bawah Hero) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
        <video
          ref={bg2Ref}
          src="/bg2.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover object-top select-none"
        />
        {/* Soft Contrast Tint */}
        <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]"></div>
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

      {/* SECTION 1: FULLSCREEN HERO / INTRO SECTION (Dual layer crossfade untuk transisi looping super mulus) */}
      <section 
        className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 py-12 overflow-hidden snap-card bg-black shadow-2xl"
        id="invite"
      >
        {/* Fullscreen Dual Video bg1 for ultra-smooth crossfade looping */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-black">
          {/* Layer A */}
          <video
            ref={bg1ARef}
            src="/bg1.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => handleBg1TimeUpdate('A')}
            className={`absolute inset-0 w-full h-full object-cover object-center select-none transition-opacity duration-1000 ease-in-out ${
              activeBg1Layer === 'A' ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Layer B */}
          <video
            ref={bg1BRef}
            src="/bg1.mp4"
            muted
            playsInline
            preload="auto"
            onTimeUpdate={() => handleBg1TimeUpdate('B')}
            className={`absolute inset-0 w-full h-full object-cover object-center select-none transition-opacity duration-1000 ease-in-out ${
              activeBg1Layer === 'B' ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Dark Contrast Tint */}
          <div className="absolute inset-0 bg-black/35 backdrop-blur-[0.5px]"></div>
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

      {/* Floating Audio Player (Selalu aktif di DOM agar musik langsung berputar seketika) */}
      <AudioPlayer autoPlayTrigger={isAudioAutoPlay} showButton={isInvitationRevealed || isHeroCardVisible} />
    </div>
  );
}
