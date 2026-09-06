import React, { useRef, useState, useEffect } from 'react';

export function GroomSection({ onPhotoClick }) {
  const [isGroomInView, setIsGroomInView] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const groomRef = useRef(null);

  useEffect(() => {
    const groomObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsGroomInView(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const gEl = groomRef.current;
    if (gEl) groomObserver.observe(gEl);

    return () => {
      if (gEl) groomObserver.unobserve(gEl);
    };
  }, []);

  const handlePhotoClick = () => {
    if (onPhotoClick) {
      onPhotoClick({ src: '/arfan.jpeg', name: 'Muhammad arfan' });
    } else {
      setIsZoomed(true);
    }
  };

  return (
    <section
      ref={groomRef}
      className="w-full text-center p-6 sm:p-8 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]"
      id="couple"
    >
      <div className="inline-block px-4 py-1 rounded-full border border-secondary/40 bg-secondary/15 backdrop-blur-sm mb-5">
        <p className="font-label-caps text-[11px] text-secondary uppercase tracking-widest font-semibold">
          The Groom • Mempelai Pria
        </p>
      </div>

      {/* Photo Frame with Click to Enlarge */}
      <div
        onClick={handlePhotoClick}
        role="button"
        tabIndex={0}
        aria-label="Lihat foto Muhammad Arfan lebih besar"
        title="Klik untuk memperbesar foto"
        className={`w-40 h-52 border-2 border-secondary/70 p-1 mb-5 relative rounded-2xl overflow-hidden shadow-2xl transform-gpu transition-all duration-[2000ms] ease-smooth-out cursor-pointer group ${isGroomInView
          ? 'scale-100 opacity-100 rotate-0 filter-none shadow-secondary/30'
          : 'scale-[0.35] opacity-0 -rotate-6 filter blur-[6px]'
          }`}
      >
        <img
          className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-105"
          alt="Muhammad Arfan"
          src="/arfan.webp"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className={`transition-all duration-1200 delay-500 ease-smooth-out ${isGroomInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
      >
        <h3 className="font-headline-md text-xl sm:text-2xl text-secondary mb-1.5 font-serif font-semibold">
          Muhammad arfan
        </h3>
        <p className="font-body-sm text-xs sm:text-[13px] text-inverse-surface/85 leading-relaxed">
          Putra Pertama dari<br />
          <span className="font-medium text-inverse-surface">Bpk. Salman Karim &amp; Ibu Zulianti</span>
        </p>
      </div>

      {/* Lightbox Modal Saat Foto Groom Ditekan */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-fade-up cursor-pointer"
          style={{ animationDuration: '250ms' }}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/60 border border-secondary/60 text-secondary flex items-center justify-center hover:bg-secondary hover:text-primary-container transition-all duration-300 z-10 shadow-2xl hover:scale-110 active:scale-95"
            aria-label="Tutup foto"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm sm:max-w-md w-full max-h-[85vh] flex items-center justify-center"
          >
            <img
              src="/arfan.webp"
              alt="Muhammad Arfan"
              decoding="async"
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-2xl border-2 border-secondary/60 shadow-2xl select-none"
            />
          </div>
        </div>
      )}
    </section>
  );
}

export function BrideSection({ onPhotoClick }) {
  const [isBrideInView, setIsBrideInView] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const brideRef = useRef(null);

  useEffect(() => {
    const brideObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsBrideInView(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    const bEl = brideRef.current;
    if (bEl) brideObserver.observe(bEl);

    return () => {
      if (bEl) brideObserver.unobserve(bEl);
    };
  }, []);

  const handlePhotoClick = () => {
    if (onPhotoClick) {
      onPhotoClick({ src: '/herlina.jpg', name: 'Herlina' });
    } else {
      setIsZoomed(true);
    }
  };

  return (
    <section
      ref={brideRef}
      className="w-full text-center p-6 sm:p-8 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[460px]"
      id="bride"
    >
      <div className="inline-block px-4 py-1 rounded-full border border-secondary/40 bg-secondary/15 backdrop-blur-sm mb-5">
        <p className="font-label-caps text-[11px] text-secondary uppercase tracking-widest font-semibold">
          The Bride • Mempelai Wanita
        </p>
      </div>

      {/* Photo Frame with Click to Enlarge */}
      <div
        onClick={handlePhotoClick}
        role="button"
        tabIndex={0}
        aria-label="Lihat foto Herlina lebih besar"
        title="Klik untuk memperbesar foto"
        className={`w-40 h-52 border-2 border-secondary/70 p-1 mb-5 relative rounded-2xl overflow-hidden shadow-2xl transform-gpu transition-all duration-[2000ms] ease-smooth-out cursor-pointer group ${isBrideInView
          ? 'scale-100 opacity-100 rotate-0 filter-none shadow-secondary/30'
          : 'scale-[0.35] opacity-0 rotate-6 filter blur-[6px]'
          }`}
      >
        <img
          className="w-full h-full object-cover rounded-xl transition-all duration-700 group-hover:scale-105"
          alt="Herlina"
          src="/herlina.webp"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div
        className={`transition-all duration-1200 delay-500 ease-smooth-out ${isBrideInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
      >
        <h3 className="font-headline-md text-xl sm:text-2xl text-secondary mb-1.5 font-serif font-semibold">
          Herlina
        </h3>
        <p className="font-body-sm text-xs sm:text-[13px] text-inverse-surface/85 leading-relaxed">
          Putri pertama dari<br />
          <span className="font-medium text-inverse-surface">Bpk. Rusli &amp; Ibu Haeriah</span>
        </p>

        {/* Instagram Profile Link (Logo Only) */}
        <div className="mt-3.5 flex justify-center">
          <a
            href="https://www.instagram.com/hrlinaa03_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Herlina"
            title="Instagram @hrlinaa03_"
            className="w-8 h-8 rounded-full border border-secondary/50 bg-secondary/10 hover:bg-secondary hover:text-primary-container text-secondary flex items-center justify-center transition-all duration-300 shadow-sm hover:scale-110 active:scale-95 group"
          >
            <svg
              className="w-4 h-4 fill-current transition-transform duration-300 group-hover:rotate-6"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Lightbox Modal Saat Foto Bride Ditekan */}
      {isZoomed && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-fade-up cursor-pointer"
          style={{ animationDuration: '250ms' }}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-black/60 border border-secondary/60 text-secondary flex items-center justify-center hover:bg-secondary hover:text-primary-container transition-all duration-300 z-10 shadow-2xl hover:scale-110 active:scale-95"
            aria-label="Tutup foto"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-sm sm:max-w-md w-full max-h-[85vh] flex items-center justify-center"
          >
            <img
              src="/herlina.webp"
              alt="Herlina"
              decoding="async"
              className="max-w-full max-h-[82vh] w-auto h-auto object-contain rounded-2xl border-2 border-secondary/60 shadow-2xl select-none"
            />
          </div>
        </div>
      )}
    </section>
  );
}

export default function CoupleSection() {
  return (
    <>
      <GroomSection />
      <BrideSection />
    </>
  );
}



