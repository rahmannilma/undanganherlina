import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function RsvpSection({ defaultGuestName = '' }) {
  const [formData, setFormData] = useState({
    name: defaultGuestName,
    attendance: 'yes',
    guests: '1',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [wishes, setWishes] = useState([
    {
      id: 1,
      name: 'Rian & Maya',
      attendance: 'yes',
      message: 'Selamat Muhammad Arfan & Herlina! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin!',
      date: 'Baru saja'
    },
    {
      id: 2,
      name: 'Dimas Setiawan',
      attendance: 'yes',
      message: 'Happy wedding brother! Lancar sampai hari H ya!',
      date: '1 jam yang lalu'
    }
  ]);

  useEffect(() => {
    if (defaultGuestName) {
      setFormData(prev => ({ ...prev, name: defaultGuestName }));
    }
    const saved = localStorage.getItem('wedding_rsvp_wishes');
    if (saved) {
      try {
        setWishes(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [defaultGuestName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#f6be3b', '#ebebd2', '#ffffff']
      });
    } catch (err) {
      console.log(err);
    }

    const newWish = {
      id: Date.now(),
      name: formData.name,
      attendance: formData.attendance,
      message: formData.message || (formData.attendance === 'yes' ? 'Hadir dan mendoakan kelancaran acara.' : 'Mohon maaf belum bisa hadir.'),
      date: 'Baru saja'
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    localStorage.setItem('wedding_rsvp_wishes', JSON.stringify(updated));
    setSubmitted(true);
  };

  return (
    <section className="w-full text-center p-6 sm:p-7 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden" id="rsvp">
      <h2 className="font-headline-md text-xl sm:text-2xl text-secondary mb-2">
        RSVP &amp; Ucapan
      </h2>
      <p className="font-body-sm text-xs text-inverse-surface opacity-80 mb-6">
        Mohon konfirmasi kehadiran Anda untuk acara pernikahan kami.
      </p>

      {submitted ? (
        <div className="p-6 border border-secondary/50 bg-secondary/15 backdrop-blur-md rounded-2xl mb-6 text-center shadow-inner">
          <span className="material-symbols-outlined text-secondary text-4xl mb-2 block">
            check_circle
          </span>
          <h3 className="font-headline-md text-base text-secondary mb-1">Terima Kasih!</h3>
          <p className="font-body-sm text-xs text-inverse-surface/90">
            Konfirmasi dan doa restu Anda telah kami terima.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-5 py-2 rounded-full border border-secondary text-secondary font-label-caps text-[10px] uppercase tracking-widest hover:bg-secondary hover:text-primary-container transition-colors"
          >
            Kirim Lagi
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-left bg-surface-container/35 backdrop-blur-md p-5 border border-secondary/35 rounded-2xl shadow-sm">
          {/* Full Name */}
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder=" "
              className="block w-full px-0 py-2 bg-transparent border-0 border-b border-inverse-surface/40 text-inverse-surface text-sm focus:ring-0 focus:border-secondary peer transition-colors"
            />
            <label
              htmlFor="name"
              className="absolute left-0 top-2 text-inverse-surface/50 text-xs transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-[10px] peer-valid:-top-3.5 peer-valid:text-[10px] peer-valid:text-secondary pointer-events-none"
            >
              Nama Lengkap
            </label>
          </div>

          {/* Attendance Radio */}
          <div>
            <p className="font-label-caps text-[11px] text-secondary mb-2 uppercase tracking-wider font-semibold">
              Kehadiran:
            </p>
            <div className="flex gap-2.5">
              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="yes"
                  checked={formData.attendance === 'yes'}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className="peer sr-only"
                />
                <div className="w-full text-center py-2 rounded-xl border border-inverse-surface/40 text-inverse-surface text-xs peer-checked:bg-secondary peer-checked:text-primary-container peer-checked:border-secondary peer-checked:font-semibold transition-all duration-300 shadow-sm">
                  Hadir
                </div>
              </label>

              <label className="flex-1 cursor-pointer">
                <input
                  type="radio"
                  name="attendance"
                  value="no"
                  checked={formData.attendance === 'no'}
                  onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                  className="peer sr-only"
                />
                <div className="w-full text-center py-2 rounded-xl border border-inverse-surface/40 text-inverse-surface text-xs peer-checked:bg-secondary peer-checked:text-primary-container peer-checked:border-secondary peer-checked:font-semibold transition-all duration-300 shadow-sm">
                  Maaf Berhalangan
                </div>
              </label>
            </div>
          </div>

          {/* Guests Select */}
          {formData.attendance === 'yes' && (
            <div className="relative">
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                className="block w-full px-0 py-2 bg-transparent border-0 border-b border-inverse-surface/40 text-inverse-surface text-xs focus:ring-0 focus:border-secondary appearance-none cursor-pointer"
              >
                <option className="bg-primary-container text-inverse-surface" value="1">
                  1 Orang
                </option>
                <option className="bg-primary-container text-inverse-surface" value="2">
                  2 Orang
                </option>
              </select>
              <span className="material-symbols-outlined absolute right-0 top-2.5 text-inverse-surface/50 pointer-events-none text-base">
                expand_more
              </span>
            </div>
          )}

          {/* Wishes Textarea */}
          <div className="relative">
            <textarea
              id="message"
              name="message"
              rows={2}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder=" "
              className="block w-full px-0 py-2 bg-transparent border-0 border-b border-inverse-surface/40 text-inverse-surface text-xs focus:ring-0 focus:border-secondary peer transition-colors resize-none"
            ></textarea>
            <label
              htmlFor="message"
              className="absolute left-0 top-2 text-inverse-surface/50 text-xs transition-all duration-300 peer-focus:-top-3.5 peer-focus:text-secondary peer-focus:text-[10px] pointer-events-none"
            >
              Ucapan &amp; Doa Restu
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-full border border-secondary bg-secondary text-primary-container font-label-caps text-xs hover:bg-transparent hover:text-secondary transition-all duration-300 uppercase tracking-widest group shadow-sm active:scale-[0.98]"
            >
              Kirim Konfirmasi
            </button>
          </div>
        </form>
      )}

      {/* Wishes List */}
      <div className="mt-8 text-left">
        <h3 className="font-headline-md text-secondary text-center mb-4 text-sm font-semibold">
          Ucapan &amp; Doa ({wishes.length})
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {wishes.map((item) => (
            <div
              key={item.id}
              className="p-3 border border-secondary/25 bg-surface-container/35 backdrop-blur-md rounded-xl shadow-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-xs text-secondary">
                  {item.name}
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-label-caps ${item.attendance === 'yes' ? 'bg-secondary/20 text-secondary' : 'bg-inverse-surface/10 text-inverse-surface/70'
                  }`}>
                  {item.attendance === 'yes' ? 'Hadir' : 'Absen'}
                </span>
              </div>
              <p className="text-[11px] text-inverse-surface/85 leading-relaxed">
                {item.message}
              </p>
              <span className="text-[9px] text-inverse-surface/50 mt-1 block font-mono">
                {item.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
