/**
 * ESC/POS Thermal Printer Helper
 * Utility untuk membuat command raw byte ESC/POS untuk cetak 2 rangkap (Double Print)
 */

export const ESC_POS = {
  INIT: '\x1B\x40',             // Inisialisasi printer
  ALIGN_LEFT: '\x1B\x61\x00',   // Rata Kiri
  ALIGN_CENTER: '\x1B\x61\x01', // Rata Tengah
  ALIGN_RIGHT: '\x1B\x61\x02',  // Rata Kanan
  BOLD_ON: '\x1B\x45\x01',      // Bold Aktif
  BOLD_OFF: '\x1B\x45\x00',     // Bold Nonaktif
  FEED_3: '\x1B\x64\x03',       // Feed 3 baris
  CUT_FULL: '\x1D\x56\x00',     // Potong kertas penuh
  CUT_PARTIAL: '\x1D\x56\x01',  // Potong kertas sebagian
  FEED_AND_CUT: '\x1D\x56\x41\x00', // Feed & Cut
};

/**
 * Format string agar rata kiri & kanan pada lebar tertentu (misal 32 kolom untuk 58mm)
 */
export function formatRow(leftText, rightText, maxCols = 32) {
  const spaceCount = Math.max(0, maxCols - leftText.length - rightText.length);
  return leftText + ' '.repeat(spaceCount) + rightText + '\n';
}

/**
 * Generate string payload untuk 1 lembar struk
 */
export function generateSingleReceipt(order, copyTitle = 'LEMBAR PELANGGAN', maxCols = 32) {
  let p = '';
  p += ESC_POS.INIT;
  
  // Header
  p += ESC_POS.ALIGN_CENTER;
  p += ESC_POS.BOLD_ON + order.storeName + '\n' + ESC_POS.BOLD_OFF;
  p += order.storeAddress + '\n';
  p += 'Telp: ' + order.storePhone + '\n';
  p += `*** ${copyTitle} ***\n`;
  p += '-'.repeat(maxCols) + '\n';

  // Info Transaksi
  p += ESC_POS.ALIGN_LEFT;
  p += formatRow('No:', order.receiptNo, maxCols);
  p += formatRow('Kasir:', order.cashierName, maxCols);
  p += formatRow('Waktu:', order.dateTime, maxCols);
  p += '-'.repeat(maxCols) + '\n';

  // Item List
  order.items.forEach((item) => {
    p += item.name + '\n';
    p += formatRow(`  ${item.qty}x ${item.price.toLocaleString('id-ID')}`, item.subtotal.toLocaleString('id-ID'), maxCols);
  });
  p += '-'.repeat(maxCols) + '\n';

  // Summary
  p += formatRow('Subtotal', order.subtotal.toLocaleString('id-ID'), maxCols);
  if (order.discount > 0) {
    p += formatRow('Diskon', `-${order.discount.toLocaleString('id-ID')}`, maxCols);
  }
  p += formatRow('PPN', order.tax.toLocaleString('id-ID'), maxCols);
  p += ESC_POS.BOLD_ON;
  p += formatRow('TOTAL', order.total.toLocaleString('id-ID'), maxCols);
  p += ESC_POS.BOLD_OFF;
  p += '.'.repeat(maxCols) + '\n';
  p += formatRow('Bayar (' + order.paymentMethod + ')', order.cashAmount.toLocaleString('id-ID'), maxCols);
  p += formatRow('Kembali', order.changeAmount.toLocaleString('id-ID'), maxCols);
  p += '-'.repeat(maxCols) + '\n';

  // Footer
  p += ESC_POS.ALIGN_CENTER;
  p += 'TERIMA KASIH\n';
  p += (order.notes || '') + '\n\n\n\n';
  
  // Cut paper
  p += ESC_POS.FEED_AND_CUT;
  return p;
}

/**
 * Generate payload struk 2 kali (Lembar Pelanggan + Lembar Toko)
 */
export function generateDoubleReceipt(order, maxCols = 32) {
  const customerCopy = generateSingleReceipt(order, 'LEMBAR PELANGGAN', maxCols);
  const merchantCopy = generateSingleReceipt(order, 'LEMBAR TOKO / ARSIP', maxCols);
  return customerCopy + merchantCopy;
}
