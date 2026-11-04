# GroceryIn - Smart Grocery & Budget Safety Tracker (PWA)

Aplikasi web mobile PWA bergaya *native app* dengan palet warna **Cream / Coklat Muda Estetik**, dirancang khusus untuk seorang **siswa rantau** yang belanja bulanan sambil mendorong troli supermarket.

---

## 🌟 Fitur Utama & Alur Pengguna

### 1. 📱 Format Tampilan Mobile (Rasio 9:16 / 430px : 764px)
- **Desain Mobile UI**: Dibatasi maksimal `430px` dan berada tepat di tengah layar jika dibuka lewat browser laptop/PC desktop dengan frame ponsel pintar estetik.
- **PWA (Progressive Web App)**: Dilengkapi `manifest.json`, icon multi-resolusi, dan Service Worker (`sw.js`) untuk dukungan *Add to Home Screen* dan mode *offline*.
- **Palet Warna Cream & Coklat Muda Estetik**:
  - Background: `#FAF6F0` (warm cream)
  - Surface: `#FFFFFF` dan `#F5EBE0` (soft latte foam)
  - Aksen: `#8C6239` (warm caramel brown) dan `#5E3D21` (kopi moka pekat)
  - Teks: `#2C221E` (espresso dark roast)

---

### 2. 🏪 Pemilihan Supermarket & Kunci Budget (Setup Awal)
1. **Pemilihan Daerah & Lokasi Supermarket**:
   - Pilihan daerah: **Jakarta Barat (Puri Indah)**, **Jabodetabek / Jakarta**, **Bandung**, **Yogyakarta**, **Surabaya**, **Malang**, **Semarang**, **Medan**, **Bali**.
   - Lokasi supermarket unggulan: **Lotte Mart Grocery - Puri Indah**, serta pilihan **Family Mart**, **Indomaret**, **Alfamart**, dan **Alfamidi** yang disaring otomatis sesuai ketersediaan di daerah yang dipilih.
2. **Batas Budget Belanja (Safety Cap)**:
   - Nominal uang maksimal yang menjadi pembatas belanja.
   - **TIDAK BISA DIUBAH** setelah masuk ke tab berbelanja demi disiplin keuangan anak rantau.
3. **Tombol "Confirm"**:
   - Mengambil data katalog harga, promo diskon, dan fluktuasi harga acuan bulan lalu dari supermarket yang dipilih.

---

### 3. 🏠 Homepage Layout & Navigasi
- **3 Tab di Kiri Atas**:
  - **Store**: Tab berbelanja & melihat katalog barang.
  - **List**: Tab troli aktif dengan counter badge jumlah barang.
  - **History**: Tab riwayat transaksi yang sudah di-checkout.
- **Diatas Kanan**:
  - **Nominal Sisa Budget**: Menampilkan sisa budget secara realtime (`Sisa: Rp ...`).
  - **Tombol "Log out"**: Berfungsi jika ada kesalahan input uang atau ingin berganti supermarket.
- **Store Location Sub-Bar**:
  - Menampilkan nama supermarket & cabang (misal: `🏬 Lotte Mart Grocery - Puri Indah • Jakarta Barat`).
  - Tombol **`+ Tambah / Edit Barang`** untuk mengelola atau mengubah harga barang secara realtime.
- **Floating Bottom Navigation Bar**:
  - Menu melayang di bagian bawah dengan ikon Lucide untuk kenyamanan akses satu jempol tangan.

---

### 4. 🏬 Tab 1: Store (Katalog Barang & Fluktuasi Harga)
- Format tiles vertikal yang dapat di-scroll dari atas ke bawah:
  - **Foto Barang**
  - **Nama Barang**
  - **Harga - Diskon - Harga2 - Emote**:
    - **Harga**: Harga asli (dicoret & berubah abu-abu jika ada diskon).
    - **Diskon**: Persentase potongan (misal: `-10%`, `-20%`).
    - **Harga2**: Harga efektif setelah diskon dengan rumus:  
      $$\text{Harga2} = \text{Harga} - (\text{Diskon} \times \text{Harga})$$
    - **Emote Fluktuasi vs Bulan Lalu**:
      - 🔺 **`⬆` (Merah)**: Jika harga produk meningkat dibanding bulan lalu.
      - 🔻 **`⬇︎` (Hijau)**: Jika harga produk menurun dibanding bulan lalu (pilihan hemat).
      - ⚖️ **`=` (Abu-abu)**: Jika harga produk stabil / sama dengan bulan lalu.
  - **Tombol "Add to list"**:
    - Menambahkan barang ke troli dan memotong sisa budget secara *realtime*.
    - **Aturan Budget Habis**: Jika sisa budget tidak cukup, tombol otomatis dinonaktifkan (*disabled*) dan muncul peringatan untuk mengurangi barang di List terlebih dahulu.
  - **Tombol Edit (✏️)**:
    - Tersemat pada setiap kartu barang untuk mengubah harga, diskon, atau acuan bulan lalu secara langsung di toko.

---

### 5. 📦 Daftar Barang Default & Fluktuasi Acuan Pasar
Aplikasi dilengkapi 14 komoditas bahan pokok default:
1. **Beras 5kg**: Rp 74.000 *(Bulan lalu Rp 68.000 &rarr; 🔺 Naik: Panah Merah Atas `⬆`)*
2. **Telur 1kg**: Rp 28.000 *(Bulan lalu Rp 32.000 &rarr; 🔻 Turun: Panah Hijau Bawah `⬇︎`, Tanpa Diskon)*
3. **Garam 500g**: Rp 5.000 *(Bulan lalu Rp 5.000 &rarr; ⚖️ Setara: Tanda Setara Abu-abu `= `)*
4. **Beras 5kg (Premium)**: Rp 74.500
5. **Minyak Goreng 2L**: Rp 42.000
6. **Indomie Goreng 5 pcs**: Rp 16.500
7. **Indomie Kuah 5 pcs**: Rp 16.000
8. **Tepung Terigu 1kg**: Rp 15.500
9. **Gula Pasir 1kg**: Rp 19.500
10. **Susu Ultra Milk 1L**: Rp 22.500
11. **Aqua 6 Botol**: Rp 24.000
12. **Daging Sapi 300g**: Rp 55.000
13. **Sabun Cuci**: Rp 20.000
14. **Sabun Mandi**: Rp 29.500

> 🛡️ **Jaminan Database Realtime**:  
> Semua data di atas adalah nilai default. Pengguna dapat mengubah nama, harga saat ini, harga bulan lalu, maupun diskon secara realtime. Data yang sudah diubah **akan tersimpan permanen di database perangkat (`localStorage`)**. Ketika ada pembaruan atau perbaikan kode aplikasi, **data hasil editan pengguna TIDAK AKAN terganti atau kembali ke default**, melainkan tetap mempertahankan perubahan terakhir pengguna.

---

### 6. 🛒 Tab 2: List (Troli Belanja & Ceklis)
- Format kartu belanja:
  ```
  X --------------------
   |Gambar barang| Nama barang
   |             |
   |             | Hargatotal   quantity -[]+
    ---------------------
  ```
  - **`X`**: Tombol hapus item dari list (mengembalikan uang kembali ke sisa budget).
  - **`Hargatotal`**: Subtotal harga barang ($\text{Harga2} \times \text{Quantity}$).
  - **`quantity -[]+`**: Stepper kuantitas ramah jempol. Kotak `[]` dapat diketik manual maupun dinaik-turunkan dengan tombol minus (`-`) dan plus (`+`).
- **Bottom Bar (Border Hitam, Fading Color & Checkout)**:
  - Di bagian paling bawah terdapat border berwarna hitam yang memunculkan **Total Harga Belanja**.
  - **Transisi Warna (*Fading Color Transition*)**: Semakin dekat total harga dengan batas budget, warna font yang awalnya **Hijau** memudar transisi menjadi **Kuning &rarr; Oranye &rarr; Merah Pekat** saat budget sudah habis.
  - **Tombol "Checkout"**: Mengunci list belanja, menampilkan struk belanja kasir (*Receipt Printable*), mengarsipkan transaksi ke tab History, dan mengosongkan troli aktif.

---

### 7. 📜 Tab 3: History (Riwayat Belanja)
- Menyimpan seluruh transaksi belanja yang telah di-checkout lengkap dengan tanggal, supermarket, dan jumlah uang yang dibelanjakan.
- Format tiles riwayat:
  ```
  Today/Yesterday/Tanggal - Total Harga
   --------------------
   |Gambar barang| Nama barang
   |             |
   |             | Hargatotal   [] quantity 
    ---------------------
  ```

---

## 🚀 Cara Menjalankan

1. Buka file `index.html` langsung di browser favorit Anda (Chrome, Edge, Safari, Firefox), atau
2. Jalankan server lokal:
   ```powershell
   node server.js
   ```
   Lalu buka URL: `http://localhost:3000/`
