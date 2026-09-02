import React, { useState, useEffect, useRef } from 'react';

export default function GallerySection() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const rotationRef = useRef(0);
  const isAutoPlayRef = useRef(true);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const reqAnimRef = useRef(null);
  const resumeTimerRef = useRef(null);

  // 13 Photos from 1.jpg to 13.jpg
  const photos = Array.from({ length: 13 }, (_, i) => ({
    id: i + 1,
    src: `/${i + 1}.jpg`,
    alt: `Momen Bahagia Arfan & Herlina ${i + 1}`
  }));

  const totalPhotos = photos.length;
  const angleStep = 360 / totalPhotos; // ~27.69 deg

  // Radius for 3D circle (calculated so cards sit nicely in a cylinder)
  const radius = 230; // 230px radius

  // Keep refs in sync with state
  useEffect(() => {
    isAutoPlayRef.current = isAutoPlay;
  }, [isAutoPlay]);

  // 60FPS continuous smooth auto-rotation loop
  useEffect(() => {
    let lastTimestamp = performance.now();

    const animate = (timestamp) => {
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (isAutoPlayRef.current && !isDraggingRef.current) {
        // Rotasi otomatis halus (kecepatan ~0.18 derajat per frame)
        const speed = 0.015 * Math.min(delta, 32);
        rotationRef.current = (rotationRef.current - speed) % 360;
        setRotation(rotationRef.current);
      }

      reqAnimRef.current = requestAnimationFrame(animate);
    };

    reqAnimRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(reqAnimRef.current);
  }, []);

  // Drag / Swipe interactions (Mouse & Touch)
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    startXRef.current = clientX;
    lastXRef.current = clientX;
    dragDistanceRef.current = 0;

    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - lastXRef.current;
    lastXRef.current = clientX;
    dragDistanceRef.current += Math.abs(deltaX);

    // Sensitivitas putaran saat digeser
    rotationRef.current = (rotationRef.current + deltaX * 0.45) % 360;
    setRotation(rotationRef.current);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);

    // Lanjutkan putaran otomatis setelah 2.5 detik idle
    resumeTimerRef.current = setTimeout(() => {
      isAutoPlayRef.current = true;
      setIsAutoPlay(true);
    }, 2500);
  };

  const handlePhotoClick = (index) => {
    // Hanya buka modal jika bukan sedang melakukan aksi drag/swipe geser
    if (dragDistanceRef.current < 8) {
      setSelectedPhotoIndex(index);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
    document.body.style.overflow = 'unset';
  };

  const nextPhoto = (e) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevPhoto = (e) => {
    e?.stopPropagation();
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const rotateStep = (direction) => {
    // Putar manual 1 slot foto (27.69 derajat)
    const target = direction === 'next' ? rotationRef.current - angleStep : rotationRef.current + angleStep;
    rotationRef.current = target;
    setRotation(target);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex]);

  return (
    <section
      className="w-full text-center p-5 sm:p-7 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden select-none"
      id="gallery"
    >
      {/* Header */}
      <div className="mb-4">
        <div className="inline-block p-1.5 rounded-full border border-secondary/30 mb-2 bg-secondary/10 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-base">3d_rotation</span>
        </div>
        <h2 className="font-headline-md text-xl sm:text-2xl text-secondary mb-1">
          Our Moments
        </h2>
        <p className="font-body-sm text-xs text-inverse-surface/75 italic">
          Koleksi momen bahagia kami
        </p>
      </div>

      {/* 3D Circular Carousel Stage */}
      <div
        className="relative w-full h-[290px] sm:h-[330px] my-2 flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: '950px',
          perspectiveOrigin: 'center 45%'
        }}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      >
        {/* Rotating 3D Cylinder Container */}
        <div
          className="relative w-[125px] sm:w-[145px] h-[175px] sm:h-[205px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`
          }}
        >
          {photos.map((photo, index) => {
            const itemAngle = index * angleStep;

            return (
              <div
                key={photo.id}
                onClick={() => handlePhotoClick(index)}
                className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-secondary/60 bg-black/40 shadow-[0_8px_25px_rgba(0,0,0,0.6)] cursor-pointer transition-transform duration-200 hover:border-secondary hover:shadow-[0_0_20px_rgba(212,175,55,0.7)] group"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: 'visible',
                  WebkitBoxReflect: 'below 4px linear-gradient(transparent, transparent 75%, rgba(0,0,0,0.3))'
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading="lazy"
                  className="w-full h-full object-cover object-center select-none group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                  draggable="false"
                />

                {/* Subtle glass shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/20 pointer-events-none"></div>

                {/* Hover zoom badge */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
                  <span className="w-8 h-8 rounded-full bg-secondary/90 text-primary-container flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-sm">fullscreen</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Helper & Controls */}
      <div className="mt-4 flex flex-col items-center gap-3">
        <p className="font-label-caps text-[10px] text-inverse-surface/70 uppercase tracking-wider flex items-center gap-1.5">
          <span className="material-symbols-outlined text-sm text-secondary animate-pulse">swipe</span>
          Geser foto untuk memutar atau klik untuk memperbesar
        </p>

        {/* Carousel Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => rotateStep('prev')}
            aria-label="Putar ke kiri"
            className="w-9 h-9 rounded-full border border-secondary/50 bg-secondary/10 hover:bg-secondary hover:text-primary-container text-secondary flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95"
            title="Putar Kiri"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>

          <button
            onClick={() => setIsAutoPlay((prev) => !prev)}
            aria-label={isAutoPlay ? "Jeda putaran" : "Mulai putaran"}
            className={`px-4 py-1.5 rounded-full border border-secondary/60 font-label-caps text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 shadow-sm active:scale-95 ${
              isAutoPlay
                ? 'bg-secondary text-primary-container font-semibold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'bg-secondary/15 text-secondary hover:bg-secondary hover:text-primary-container'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isAutoPlay ? 'pause' : 'play_arrow'}
            </span>
            <span>{isAutoPlay ? 'Otomatis' : 'Putar'}</span>
          </button>

          <button
            onClick={() => rotateStep('next')}
            aria-label="Putar ke kanan"
            className="w-9 h-9 rounded-full border border-secondary/50 bg-secondary/10 hover:bg-secondary hover:text-primary-container text-secondary flex items-center justify-center transition-all duration-300 shadow-sm active:scale-95"
            title="Putar Kanan"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal Preview */}
      {selectedPhotoIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 transition-opacity duration-300 animate-fade-up"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            aria-label="Tutup foto"
            className="absolute top-5 right-5 z-50 w-11 h-11 rounded-full bg-black/60 border border-secondary/60 text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-xl"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          {/* Photo Counter */}
          <div className="absolute top-6 left-6 z-50 px-3.5 py-1 rounded-full bg-black/60 border border-secondary/40 text-secondary font-label-caps text-xs tracking-widest shadow-md">
            {selectedPhotoIndex + 1} / {photos.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={prevPhoto}
            aria-label="Foto sebelumnya"
            className="absolute left-4 sm:left-8 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 border border-secondary/60 text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-secondary hover:text-primary-container active:scale-90 shadow-xl"
          >
            <span className="material-symbols-outlined text-2xl">chevron_left</span>
          </button>

          {/* Main Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[82vh] rounded-2xl overflow-hidden border border-secondary/40 shadow-2xl bg-black/40 flex items-center justify-center"
          >
            <img
              src={photos[selectedPhotoIndex].src}
              alt={photos[selectedPhotoIndex].alt}
              className="max-w-full max-h-[80vh] w-auto h-auto object-contain select-none transition-all duration-500"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextPhoto}
            aria-label="Foto selanjutnya"
            className="absolute right-4 sm:right-8 z-50 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 border border-secondary/60 text-secondary flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-secondary hover:text-primary-container active:scale-90 shadow-xl"
          >
            <span className="material-symbols-outlined text-2xl">chevron_right</span>
          </button>
        </div>
      )}
    </section>
  );
}
