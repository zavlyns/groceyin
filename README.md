# GroceryIn - Smart Grocery & Expense Assistant

Aplikasi web modern asisten belanja pintar dengan fitur deteksi fluktuasi harga acuan bulan lalu, diskon bertingkat (cascading discount), dan pengendali anggaran dompet (Budget Safety Cap).

---

## 🌟 Fitur Utama

1. **Autentikasi Pengguna Tunggal (Single-User Lock) & Google Sign-In**
   - Modal autentikasi saat aplikasi pertama kali dibuka.
   - Penegakan aturan **Single-User**: Perangkat terikat secara eksklusif pada 1 profil pengguna utama untuk menjaga privasi anggaran saku. Sistem menolak login multi-user yang berbeda tanpa otorisasi.
   - Pilihan masuk instan lewat **Google Sign-In** interaktif (simulasi akun Google terverifikasi).

2. **Struktur Data Belanja Lengkap**
   - **Nama Barang** (misal: Beras Ramos, Minyak Goreng, Daging Sapi)
   - **Kategori** (Sembako, Sayur & Buah, Daging & Ikan, Susu & Telur, Bumbu Dapur, Snack & Minuman, Kebersihan, Lainnya)
   - **Satuan Ukuran** (kg, liter, pcs, gram, ikat, botol, pack, kaleng)
   - **Kuantitas** (dengan tombol stepper +/- dan input desimal fleksibel)
   - **Harga Satuan Saat Ini** (Rp)
   - **Harga Riwayat Bulan Lalu** (Rp acuan pasar)
   - **Diskon Bertingkat** (Contoh: `50+20`, `30+10`)
   - **Catatan Belanja** (Merk, lokasi lorong rak, dll.)
   - **Status Pembelian** (Checklist barang yang sudah dimasukkan ke troli fisik)

3. **Logika Perhitungan Kuantitas Realtime**
   - Setiap kali angka kuantitas atau harga satuan diubah, subtotal barang langsung terhitung seketika secara otomatis tanpa perlu menekan tombol kalkulator manual.

4. **Logika Diskon Bertingkat (Cascading Compound Discount)**
   - Perhitungan diskon bertumpuk matematis:
     - Contoh promo `50% + 20%` pada barang seharga Rp 100.000:
       - Potongan Diskon 1 (50%): Rp 100.000 &rarr; Rp 50.000
       - Potongan Diskon 2 (20%): Rp 50.000 &rarr; Rp 40.000
       - Total hemat: Rp 60.000 (diskon efektif 60%, bukan potongan flat 70%).
   - Dilengkapi boks transparansi rincian rumus matematika langkah-demi-langkah.

5. **Deteksi Fluktuasi Harga Realtime (Price Fluctuation Detection)**
   - Membandingkan harga inputan saat ini dengan harga acuan bulan lalu seketika saat diketik:
     - 🔺 **Panah Merah Naik (↑)**: Jika harga naik dibanding bulan lalu (disertai nominal kenaikan dan persentase inflasi).
     - 🔻 **Panah Hijau Turun (↓)**: Jika harga turun dibanding bulan lalu (disertai nominal penghematan).
     - ⚖️ **Tanda Setara (=)**: Jika harga stabil atau tepat sama dengan bulan lalu.

6. **Pengendali Anggaran (Budget Safety Cap)**
   - Input saldo maksimal dompet / uang saku tunai yang dibawa.
   - Indikator meteran progres belanjaan realtime:
     - **Hijau (< 65%)**: Status aman terkendali.
     - **Kuning / Oranye (65% - 84%)**: Status waspada mendekati limit.
     - **Merah Menyala Berkedip / Glowing Danger Pulse (>= 85% & > 100%)**: Indikator visual menyala merah pekat dengan animasi berdenyut jika total keranjang mendekati atau melampaui limit dompet, disertai spanduk peringatan bahaya.

7. **Katalog Cepat Acuan Pasar & Struk Belanja**
   - 8 barang sembako populer dengan acuan harga riwayat pasar yang dapat langsung diklik untuk auto-fill form.
   - Fitur cetak struk belanja (*Receipt Printable*) siap print atau simpan sebagai PDF.

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi dibuat menggunakan **Vanilla HTML5, CSS3, dan JavaScript modern** tanpa dependensi yang rumit, sehingga dapat dibuka langsung di browser:

1. Buka file `index.html` langsung di browser favorit Anda (Google Chrome, Edge, Firefox), atau
2. Jalankan server lokal:
   ```powershell
   node server.js
   ```
   Lalu buka URL: `http://localhost:3000/`

---

## 🧪 Pengujian Unit Test

Jalankan test suite logika matematika:
```powershell
node test.js
```
