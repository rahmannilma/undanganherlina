import React, { useState } from 'react';
import './PosReceiptPrinter.css';

// Contoh data beberapa transaksi untuk demo Cetak Ulang (Reprint)
const SAMPLE_TRANSACTIONS = [
  {
    receiptNo: "TRX-20260830-0089",
    cashierName: "Ahmad",
    dateTime: "30/08/2026, 21:20:15",
    items: [
      { id: 1, name: "Kopi Susu Gula Aren", qty: 2, price: 18000, subtotal: 36000 },
      { id: 2, name: "Croissant Almond", qty: 1, price: 25000, subtotal: 25000 },
      { id: 3, name: "Air Mineral 600ml", qty: 2, price: 5000, subtotal: 10000 },
    ],
    subtotal: 71000,
    tax: 7100,
    discount: 5000,
    total: 73100,
    paymentMethod: "CASH / TUNAI",
    cashAmount: 100000,
    changeAmount: 26900,
    notes: "Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.",
  },
  {
    receiptNo: "TRX-20260830-0088",
    cashierName: "Siti",
    dateTime: "30/08/2026, 20:45:10",
    items: [
      { id: 1, name: "Paket Nasi Ayam Geprek", qty: 3, price: 28000, subtotal: 84000 },
      { id: 2, name: "Es Teh Manis Jumbo", qty: 3, price: 6000, subtotal: 18000 },
    ],
    subtotal: 102000,
    tax: 10200,
    discount: 0,
    total: 112200,
    paymentMethod: "QRIS STATIS",
    cashAmount: 112200,
    changeAmount: 0,
    notes: "Terima kasih atas kunjungan Anda!",
  },
  {
    receiptNo: "TRX-20260830-0087",
    cashierName: "Ahmad",
    dateTime: "30/08/2026, 19:15:30",
    items: [
      { id: 1, name: "Matcha Latte Ice", qty: 1, price: 24000, subtotal: 24000 },
      { id: 2, name: "Cheesecake Slice", qty: 1, price: 32000, subtotal: 32000 },
    ],
    subtotal: 56000,
    tax: 5600,
    discount: 6000,
    total: 55600,
    paymentMethod: "DEBIT BCA",
    cashAmount: 55600,
    changeAmount: 0,
    notes: "Follow IG kami @tokokasihmakmur",
  }
];

export default function PosReceiptPrinter({
  storeInfo = {
    storeName: "TOKO KASIR MAKMUR",
    storeAddress: "Jl. Sudirman No. 123, Jakarta Pusat",
    storePhone: "0812-3456-7890",
  },
  onPrintComplete,
}) {
  // 1. Checkbox State: Cetak 2 Rangkap
  const [isDoublePrint, setIsDoublePrint] = useState(true);

  // 2. Checkbox State: Mode Print Ulang (Reprint)
  const [isReprintMode, setIsReprintMode] = useState(false);

  // State Pilihan Transaksi
  const [selectedTrxIndex, setSelectedTrxIndex] = useState(0);
  const currentTrx = SAMPLE_TRANSACTIONS[selectedTrxIndex];

  // State Riwayat Jumlah Reprint
  const [reprintCount, setReprintCount] = useState(0);
  const [lastReprintTime, setLastReprintTime] = useState(null);

  // State Ukuran Kertas Thermal
  const [paperWidth, setPaperWidth] = useState("58mm"); // '58mm' atau '80mm'
  const [isPrinting, setIsPrinting] = useState(false);

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  // Fungsi Eksekusi Cetak
  const handlePrint = (forceReprint = false) => {
    const isReprint = forceReprint || isReprintMode;

    if (isReprint) {
      setReprintCount((prev) => prev + 1);
      setLastReprintTime(new Date().toLocaleTimeString('id-ID'));
    }

    setIsPrinting(true);

    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      if (onPrintComplete) {
        onPrintComplete({
          isReprint,
          isDoublePrint,
          receiptNo: currentTrx.receiptNo,
          reprintCount: isReprint ? reprintCount + 1 : 0,
        });
      }
    }, 150);
  };

  // Sub-Komponen Render 1 Lembar Struk
  const SingleReceipt = ({ copyLabel, isSecondCopy = false }) => (
    <div className={`receipt-slip paper-${paperWidth} ${isSecondCopy ? 'second-copy' : ''}`}>
      {/* Banner Khusus Jika Mode Cetak Ulang (Reprint) */}
      {isReprintMode && (
        <div className="reprint-watermark-banner">
          ⚠️ [ SALINAN CETAK ULANG / REPRINT #{reprintCount > 0 ? reprintCount : 1} ]
        </div>
      )}

      {/* Header Struk */}
      <div className="receipt-header text-center">
        <h2 className="store-title">{storeInfo.storeName}</h2>
        <p className="store-info">{storeInfo.storeAddress}</p>
        <p className="store-info">Telp: {storeInfo.storePhone}</p>
        
        {/* Label Lembar (Pelanggan / Toko) */}
        <div className="copy-badge">
          *** {copyLabel} ***
        </div>
      </div>

      <div className="receipt-divider-dashed"></div>

      {/* Info Transaksi */}
      <div className="receipt-meta">
        <div className="meta-row">
          <span>No. Struk:</span>
          <span className="font-bold">{currentTrx.receiptNo}</span>
        </div>
        <div className="meta-row">
          <span>Kasir:</span>
          <span>{currentTrx.cashierName}</span>
        </div>
        <div className="meta-row">
          <span>Waktu:</span>
          <span>{currentTrx.dateTime}</span>
        </div>
        {isReprintMode && lastReprintTime && (
          <div className="meta-row text-xs text-red-600">
            <span>Dicetak Ulang:</span>
            <span>{lastReprintTime}</span>
          </div>
        )}
      </div>

      <div className="receipt-divider-dashed"></div>

      {/* Daftar Item */}
      <div className="receipt-items">
        {currentTrx.items.map((item, idx) => (
          <div key={idx} className="item-row">
            <div className="item-name">{item.name}</div>
            <div className="item-details">
              <span>{item.qty} x {formatRupiah(item.price)}</span>
              <span>{formatRupiah(item.subtotal)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="receipt-divider-dashed"></div>

      {/* Ringkasan Pembayaran */}
      <div className="receipt-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{formatRupiah(currentTrx.subtotal)}</span>
        </div>
        {currentTrx.discount > 0 && (
          <div className="summary-row text-discount">
            <span>Diskon:</span>
            <span>-{formatRupiah(currentTrx.discount)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>PPN (10%):</span>
          <span>{formatRupiah(currentTrx.tax)}</span>
        </div>
        
        <div className="summary-row total-row">
          <span>TOTAL:</span>
          <span>{formatRupiah(currentTrx.total)}</span>
        </div>

        <div className="receipt-divider-dotted"></div>

        <div className="summary-row">
          <span>Metode:</span>
          <span>{currentTrx.paymentMethod}</span>
        </div>
        <div className="summary-row">
          <span>Bayar:</span>
          <span>{formatRupiah(currentTrx.cashAmount)}</span>
        </div>
        <div className="summary-row">
          <span>Kembali:</span>
          <span>{formatRupiah(currentTrx.changeAmount)}</span>
        </div>
      </div>

      <div className="receipt-divider-dashed"></div>

      {/* Footer Struk */}
      <div className="receipt-footer text-center">
        <p className="thankyou-msg">TERIMA KASIH</p>
        <p className="notes">{currentTrx.notes}</p>
        {isReprintMode && (
          <p className="reprint-disclaimer">
            *Struk ini adalah salinan sah dari sistem kasir*
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="pos-printer-container">
      {/* ========================================================================= */}
      {/* PANEL KONTROL KASIR (CHECKBOX & SETTING)                                 */}
      {/* ========================================================================= */}
      <div className="no-print pos-control-panel">
        <div className="panel-header border-b border-gray-200 pb-3 mb-4">
          <div className="flex justify-between items-center flex-wrap gap-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span>🖨️</span> Sistem Cetak Struk Kasir
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Konfigurasi cetak rangkap & pencetakan ulang transaksi
              </p>
            </div>
            
            <div className="flex gap-2">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${isDoublePrint ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                {isDoublePrint ? "✓ 2 Rangkap Aktif" : "1 Rangkap"}
              </span>
              {isReprintMode && (
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                  ⚠️ Mode Reprint Aktif
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 1. Pilih Transaksi yang Ingin Dicetak */}
        <div className="mb-4 p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
          <label className="block text-xs font-bold uppercase text-blue-900 mb-1.5">
            Pilih Nomor Struk Transaksi:
          </label>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={selectedTrxIndex}
              onChange={(e) => {
                setSelectedTrxIndex(Number(e.target.value));
                setReprintCount(0);
                setLastReprintTime(null);
              }}
              className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {SAMPLE_TRANSACTIONS.map((trx, idx) => (
                <option key={idx} value={idx}>
                  {trx.receiptNo} - {trx.paymentMethod} - {formatRupiah(trx.total)} ({trx.dateTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. AREA CHECKBOX PENGATURAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
          {/* CHECKBOX 1: Cetak 2 Rangkap */}
          <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
            isDoublePrint 
              ? 'bg-blue-50/70 border-blue-400 shadow-sm' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="checkbox"
              checked={isDoublePrint}
              onChange={(e) => setIsDoublePrint(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-bold text-gray-900 block">
                Cetak 2 Rangkap (Double Print)
              </span>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Mencetak 1x untuk <b>Pelanggan</b> dan 1x untuk <b>Kasir / Arsip Toko</b> secara otomatis.
              </p>
            </div>
          </label>

          {/* CHECKBOX 2: Mode Print Ulang (Reprint) */}
          <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
            isReprintMode 
              ? 'bg-amber-50/80 border-amber-400 shadow-sm' 
              : 'bg-white border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="checkbox"
              checked={isReprintMode}
              onChange={(e) => setIsReprintMode(e.target.checked)}
              className="mt-1 w-4 h-4 text-amber-600 rounded border-gray-300 focus:ring-amber-500 cursor-pointer"
            />
            <div>
              <span className="text-sm font-bold text-gray-900 block flex items-center gap-1.5">
                <span>Mode Cetak Ulang (Reprint)</span>
                {reprintCount > 0 && (
                  <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                    Sudah {reprintCount}x
                  </span>
                )}
              </span>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Memberi label <b>[SALINAN CETAK ULANG]</b> pada struk untuk mencegah kecurangan/klaim ganda.
              </p>
            </div>
          </label>
        </div>

        {/* 3. Pengaturan Kertas Thermal & Tombol Aksi */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-gray-600">Lebar Kertas:</span>
            <select
              value={paperWidth}
              onChange={(e) => setPaperWidth(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:ring-2 focus:ring-blue-500"
            >
              <option value="58mm">58 mm (Standard Roll)</option>
              <option value="80mm">80 mm (Wide Roll)</option>
            </select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {/* Tombol Cetak Sesuai Pilihan Checkbox */}
            <button
              onClick={() => handlePrint(false)}
              disabled={isPrinting}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>🖨️</span>
              <span>
                {isDoublePrint 
                  ? (isReprintMode ? "Cetak Ulang (2 Rangkap)" : "Cetak Struk (2 Rangkap)") 
                  : (isReprintMode ? "Cetak Ulang (1 Struk)" : "Cetak Struk (1 Lembar)")}
              </span>
            </button>

            {/* Tombol Cepat: Langsung Cetak Ulang Sekarang */}
            {!isReprintMode && (
              <button
                onClick={() => {
                  setIsReprintMode(true);
                  handlePrint(true);
                }}
                disabled={isPrinting}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                title="Langsung cetak ulang transaksi ini dengan label salinan"
              >
                <span>🔄</span>
                <span>Reprint Langsung</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AREA DOKUMEN CETAK (PREVIEW LAYAR & HASIL PRINT THERMAL)                  */}
      {/* ========================================================================= */}
      <div className="pos-print-area" id="receipt-print-area">
        {/* LEMBAR 1: Salinan Pelanggan */}
        <SingleReceipt 
          copyLabel={isReprintMode ? "LEMBAR PELANGGAN (SALINAN)" : "LEMBAR PELANGGAN"} 
          isSecondCopy={false} 
        />

        {/* PEMISAH / PAGE BREAK UNTUK CETAK 2 RANGKAP */}
        {isDoublePrint && (
          <>
            <div className="receipt-cut-line no-print">
              <span>✂ - - - - - - - - - - - Garis Potong Kertas Kasir - - - - - - - - - - - ✂</span>
            </div>
            <div className="receipt-page-break"></div>

            {/* LEMBAR 2: Salinan Kasir / Arsip Toko */}
            <SingleReceipt 
              copyLabel={isReprintMode ? "LEMBAR KASIR / ARSIP (SALINAN)" : "LEMBAR KASIR / ARSIP TOKO"} 
              isSecondCopy={true} 
            />
          </>
        )}
      </div>
    </div>
  );
}
