import React, { useState } from 'react';

export default function GiftSection() {
  const [copiedBank, setCopiedBank] = useState(null);

  const bankAccounts = [
    {
      bank: 'BANK BRI',
      number: '1939722581',
      displayNumber: '1939 7225 81',
      holder: 'Herlina',
      logo: 'account_balance'
    }
  ];

  const handleCopy = (num, bank) => {
    navigator.clipboard.writeText(num);
    setCopiedBank(bank);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  return (
    <section
      className="w-full text-center p-6 sm:p-7 bg-primary-container/45 backdrop-blur-lg rounded-3xl border border-secondary/50 shadow-2xl relative overflow-hidden"
      id="gift"
    >
      <div className="space-y-4">
        <div className="inline-block p-1.5 rounded-full border border-secondary/30 bg-secondary/10 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-2xl">
            redeem
          </span>
        </div>

        <h2 className="font-headline-md text-xl sm:text-2xl text-secondary">
          Wedding Gift
        </h2>

        <p className="font-body-sm text-xs text-inverse-surface/80 leading-relaxed max-w-xs mx-auto">
          Doa restu Anda adalah karunia terindah bagi kami. Bagi yang ingin memberikan tanda kasih secara digital:
        </p>

        {/* Luxury ATM-Style Digital Gift Card */}
        <div className="pt-2 max-w-[340px] mx-auto">
          {bankAccounts.map((acc) => (
            <div
              key={acc.bank}
              className="relative overflow-hidden p-5 rounded-2xl border-2 border-secondary/60 bg-gradient-to-br from-black/40 via-black/25 to-secondary/10 backdrop-blur-md shadow-xl text-left transition-all duration-300 hover:border-secondary hover:shadow-[0_8px_30px_rgba(212,175,55,0.25)]"
            >
              {/* Decorative Corner Glow */}
              <div className="absolute top-0 right-0 w-28 h-28 bg-secondary/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Card Header: Chip & Bank Name */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {/* Gold SIM Chip */}
                  <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-[#D4AF37] via-[#FFE088] to-[#997300] p-1 flex items-center justify-center shadow-inner opacity-90">
                    <div className="w-full h-full border border-black/30 rounded-sm grid grid-cols-2 gap-0.5 opacity-60">
                      <div className="border-r border-black/30"></div>
                      <div></div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-secondary/70 text-lg rotate-90">
                    contactless
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 border border-secondary/40 backdrop-blur-sm">
                  <span className="font-headline-md font-bold text-secondary text-xs tracking-wider">
                    {acc.bank}
                  </span>
                </div>
              </div>

              {/* Account Number */}
              <div className="my-3">
                <p className="font-label-caps text-[10px] text-inverse-surface/70 uppercase tracking-widest mb-1">
                  Nomor Rekening
                </p>
                <p className="font-mono text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#7A5816] drop-shadow-sm select-all">
                  {acc.displayNumber}
                </p>
              </div>

              {/* Account Holder Name */}
              <div className="mb-4">
                <p className="font-label-caps text-[10px] text-inverse-surface/70 uppercase tracking-widest mb-0.5">
                  Atas Nama
                </p>
                <p className="font-serif text-sm sm:text-base font-semibold text-inverse-surface uppercase tracking-wider">
                  {acc.holder}
                </p>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(acc.number, acc.bank)}
                className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs uppercase font-label-caps tracking-widest transition-all duration-300 shadow-md active:scale-95 ${
                  copiedBank === acc.bank
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-900/40 font-semibold'
                    : 'bg-secondary text-primary-container border-secondary font-semibold hover:bg-transparent hover:text-secondary hover:shadow-lg'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  {copiedBank === acc.bank ? 'check_circle' : 'content_copy'}
                </span>
                <span>
                  {copiedBank === acc.bank ? 'Nomor Rekening Tersalin!' : 'Salin Nomor Rekening'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
