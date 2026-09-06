import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../utils/supabase';

const formatWishDate = (dateVal) => {
  if (!dateVal) return 'Baru saja';
  if (typeof dateVal === 'string' && (dateVal.includes('lalu') || dateVal === 'Baru saja')) {
    return dateVal;
  }
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WITA';
  } catch {
    return 'Baru saja';
  }
};

export default function RsvpSection({ defaultGuestName = '' }) {
  const [formData, setFormData] = useState({
    name: defaultGuestName,
    attendance: 'yes',
    guests: '1',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    if (defaultGuestName) {
      setFormData(prev => ({ ...prev, name: defaultGuestName }));
    }

    // 1. Muat dulu data dari penyimpanan lokal agar ucapan tidak hilang saat reload
    const saved = localStorage.getItem('wedding_rsvp_wishes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setWishes(parsed);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Jika Supabase aktif, ambil data terbaru dari Supabase
    if (isSupabaseConfigured && supabase) {
      const fetchWishes = async () => {
        try {
          const { data, error } = await supabase
            .from('wishes')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            setWishes(data);
            localStorage.setItem('wedding_rsvp_wishes', JSON.stringify(data));
          } else if (error) {
            console.warn('Supabase fetch error (pastikan tabel wishes sudah dibuat):', error.message);
          }
        } catch (err) {
          console.error('Gagal mengambil data dari Supabase:', err);
        }
      };

      fetchWishes();

      // Dengarkan ucapan baru secara real-time
      const channel = supabase
        .channel('realtime_wishes')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'wishes' },
          (payload) => {
            if (payload.new) {
              setWishes((prev) => {
                if (prev.some((w) => w.id === payload.new.id)) return prev;
                const next = [payload.new, ...prev];
                localStorage.setItem('wedding_rsvp_wishes', JSON.stringify(next));
                return next;
              });
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [defaultGuestName]);

  const triggerConfetti = () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const defaultMsg = formData.attendance === 'yes'
      ? 'Hadir dan mendoakan kelancaran acara.'
      : 'Mohon maaf belum bisa hadir.';

    const wishPayload = {
      name: formData.name.trim(),
      attendance: formData.attendance,
      guests: formData.attendance === 'yes' ? parseInt(formData.guests) || 1 : 0,
      message: formData.message.trim() || defaultMsg
    };

    // Simpan langsung ke tampilan & penyimpanan lokal agar ucapan tidak hilang
    triggerConfetti();
    const tempWish = {
      id: Date.now(),
      ...wishPayload,
      created_at: new Date().toISOString()
    };

    setWishes((prev) => {
      const next = [tempWish, ...prev];
      localStorage.setItem('wedding_rsvp_wishes', JSON.stringify(next));
      return next;
    });
    setSubmitted(true);

    // Kirim ke database Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('wishes')
          .insert([wishPayload])
          .select();

        if (error) {
          console.error('Supabase error saat insert wishes:', error);
          alert('Pemberitahuan: Tabel "wishes" belum ada di Supabase atau izin RLS belum diaktifkan! Pesan Anda tersimpan di browser untuk sementara.\n\nDetail error: ' + error.message);
        } else if (data && data.length > 0) {
          // Perbarui dengan data id resmi dari Supabase
          setWishes((prev) => {
            const updated = prev.map((w) => (w.id === tempWish.id ? data[0] : w));
            localStorage.setItem('wedding_rsvp_wishes', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (err) {
        console.error('Gagal mengirim ke Supabase:', err);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
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
              disabled={isSubmitting}
              className={`w-full py-3 rounded-full border border-secondary bg-secondary text-primary-container font-label-caps text-xs transition-all duration-300 uppercase tracking-widest group shadow-sm ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-transparent hover:text-secondary active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Mengirim Ucapan & Konfirmasi...' : 'Kirim Konfirmasi'}
            </button>
          </div>
        </form>
      )}

      {/* Wishes List (Hanya tampil jika sudah ada ucapan yang masuk) */}
      {wishes.length > 0 && (
        <div className="mt-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-secondary text-sm font-semibold">
              Ucapan &amp; Doa ({wishes.length})
            </h3>
            {isSupabaseConfigured && (
              <span className="inline-flex items-center gap-1 text-[9px] text-emerald-400/90 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Sync
              </span>
            )}
          </div>

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
                  {formatWishDate(item.created_at || item.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
