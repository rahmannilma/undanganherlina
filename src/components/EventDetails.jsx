import React, { useRef, useState, useEffect } from 'react';

export default function EventDetails() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 0px 0px'
      }
    );

    const current = sectionRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, []);

  const googleMapsUrl = "https://www.google.com/maps?q=-2.5540842,119.0583749";

  const createCalendarUrl = () => {
    const title = encodeURIComponent("The Wedding of Muhammad Arfan & Herlina");
    const details = encodeURIComponent("Akad Nikah: 11:00 - Selesai WITA\nResepsi: 12:00 - Selesai WITA\nLokasi: Belakang Pasar Lekbeng (Kediaman Mempelai Wanita)");
    const location = encodeURIComponent("Belakang Pasar Lekbeng (Kediaman Mempelai Wanita)");
    const start = "20260927T030000Z";
    const end = "20260927T080000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  return (
    <section
      ref={sectionRef}
      className="w-full text-center p-6 sm:p-7 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden"
      id="event"
    >
      <h2 className="font-headline-md text-xl sm:text-2xl text-secondary mb-6">
        Event Details
      </h2>

      <div className="space-y-6">
        {/* Akad Nikah (Animasi Jatuh dari Atas) */}
        <div
          className={`p-4 rounded-2xl border border-secondary/35 bg-surface-container/35 backdrop-blur-md shadow-md ${isInView ? 'animate-drop-bounce' : 'opacity-0'
            }`}
          style={{
            opacity: 0,
            animationDuration: '2.5s',
            animationDelay: '200ms',
            animationFillMode: 'both'
          }}
        >
          <div className="inline-block p-1.5 rounded-full border border-secondary/30 mb-1.5 bg-secondary/10 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-base">favorite</span>
          </div>
          <h3 className="font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest font-semibold">
            Akad Nikah
          </h3>
          <p className="font-body-lg text-sm text-inverse-surface font-medium">
            11:00 - Selesai WITA
          </p>
          <p className="font-body-sm text-[11px] text-inverse-surface/70 mt-0.5">
            Minggu, 27 September 2026
          </p>
        </div>

        {/* Resepsi (Animasi Jatuh dari Atas) */}
        <div
          className={`p-4 rounded-2xl border border-secondary/35 bg-surface-container/35 backdrop-blur-md shadow-md ${isInView ? 'animate-drop-bounce' : 'opacity-0'
            }`}
          style={{
            opacity: 0,
            animationDuration: '2.5s',
            animationDelay: '900ms',
            animationFillMode: 'both'
          }}
        >
          <div className="inline-block p-1.5 rounded-full border border-secondary/30 mb-1.5 bg-secondary/10 shadow-sm">
            <span className="material-symbols-outlined text-secondary text-base">celebration</span>
          </div>
          <h3 className="font-label-caps text-xs text-secondary mb-1 uppercase tracking-widest font-semibold">
            Resepsi
          </h3>
          <p className="font-body-lg text-sm text-inverse-surface font-medium">
            12:00 - Selesai WITA
          </p>
          <p className="font-body-sm text-[11px] text-inverse-surface/70 mt-0.5">
            Minggu, 27 September 2026
          </p>
        </div>

        {/* Location & Interactive Embedded Maps */}
        <div
          className={`pt-2 transition-all duration-1000 delay-600 ease-smooth-out ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
        >
          <h3 className="font-headline-md text-base text-secondary mb-1 font-serif">
            Belakang Launa Graha Kalukku (Pasar Lekbeng),Ling Salubiru,Kel Kalukku
          </h3>
          <div className="flex items-center justify-center gap-1.5 text-secondary mb-1">
            <span className="material-symbols-outlined text-base">home</span>
            <span className="font-body-sm text-[12px] sm:text-xs font-medium tracking-wide text-inverse-surface/90">
              Kediaman Mempelai Wanita
            </span>
          </div>
          <p className="font-body-sm text-[11px] text-inverse-surface/70 mb-4">
            Lokasi Acara Pernikahan
          </p>

          {/* Embedded Google Maps Frame */}
          <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden border border-secondary/45 shadow-md mb-4 relative bg-black/20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d7369.622369124937!2d119.05837487653854!3d-2.5540842403652397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMsKwMzMnMjAuMyJTIDExOcKwMDMnNDcuMCJF!5e0!3m2!1sid!2sid!4v1788362461509!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Peta Lokasi Pernikahan"
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col gap-2.5" id="map">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-secondary bg-secondary text-primary-container font-label-caps text-xs hover:bg-transparent hover:text-secondary transition-all duration-300 uppercase tracking-widest group shadow-md rounded-full font-semibold"
            >
              <span className="material-symbols-outlined mr-1.5 text-base">
                directions
              </span>
              Petunjuk Arah (Google Maps)
            </a>

            <a
              href={createCalendarUrl()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 border border-secondary/60 bg-secondary/10 text-secondary font-label-caps text-xs hover:bg-secondary hover:text-primary-container transition-all duration-300 uppercase tracking-widest group shadow-sm rounded-full"
            >
              <span className="material-symbols-outlined mr-1.5 text-base">
                event
              </span>
              Simpan Kalender
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
