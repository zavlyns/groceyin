# GroceryIn - Smart Grocery & Budget Safety Tracker (PWA)

Aplikasi web mobile PWA bergaya *native app* dengan tema modern **Background Hitam Pekat & List-List Berwarna Merah (Crimson Black/Red Edition)**, dirancang khusus untuk seorang **siswa rantau** yang belanja bulanan sambil mendorong troli supermarket.

---

## 🌟 Fitur Baru & Perbaikan Utama

### 1. 📏 Penentuan Satuan (Unit), Kuantitas, dan Diskon Saat Menambahkan ke List
- Saat menekan tombol **"+ Add to list"** pada barang di katalog atau tombol **"✏️ Atur"** di tab troli, muncul modal interaktif:
  - **Pilih Satuan Ukuran**: `pcs`, `kg`, `gram`, `liter`, `ml`, `pack`, `botol`, `ikat`, atau input satuan kustom (*dus, kaleng, butir, dll*).
  - **Tentukan Kuantitas**: Stepper `- [Qty] +` dan tombol cepat `+1`, `+2`, `+5`.
  - **Tentukan Diskon**:
    - Mode **Persentase (%)**: Preset cepat `0% (Normal)`, `5%`, `10%`, `15%`, `20%`, `25%`, `50%`, atau input persentase kustom.
    - Mode **Nominal Rupiah (Rp)**: Masukkan langsung potongan harga nominal per satuan (misal: `-Rp 5.000`).
  - **Kalkulasi & Pengecekan Budget Realtime**: Memastikan total belanjaan tidak melebihi sisa uang saku sebelum dimasukkan ke dalam list.

### 2. 🎨 Tema UI Baru: Background Hitam & List Berwarna Merah
- **Background Utama**: Hitam pekat (`#000000` / `#0C0C0E` / `#121216`) dengan kontras teks putih tajam.
- **List-List Berwarna Merah**: Kartu troli belanja (*Shopping List Card*) berbingkai merah crimson pekat (`#DC2626` / `#EF4444`) dengan glowing shadow merah, tag indeks merah, badge satuan & diskon merah, serta tombol aksi merah.
- **Header & Bottom Bar**: Tampilan gelap transparan dengan aksen border merah neon yang modern dan ramah mata di malam hari.

### 3. 🔐 Lobby: Pilihan Sign In Username & Email serta Sign In Google
- Pada halaman awal (Lobby) sebelum memilih lokasi dan supermarket tujuan:
  - **Masuk dengan Username & Email**: Formulir cepat untuk membuat atau masuk ke profil pengguna.
  - **Sign In dengan Google**: Tombol resmi Google dengan logo multi-warna yang memicu dialog autentikasi Google akun rantau (Rian Maulana, Daffa, atau akun kustom).
  - **Profil Pengguna**: Menampilkan foto/avatar dan nama pengguna di kartu lobby serta di bilah navigasi atas (*Top Bar*).

### 4. 📲 Pilihan "Instal aplikasi ini ke handphone" (Direct Mobile Download & PWA)
- Tombol terpasang di **Lobby** dan di **Top Bar Header**:
  - **Pasang Langsung ke Layar HP**: Memicu prompt native PWA OS (*Add to Home Screen*) sehingga aplikasi langsung terpasang di beranda ponsel pengguna.
  - **Unduh File Launcher / WebAPK HP**: Mengunduh langsung file launcher (`GroceryIn-App.apk` dan `GroceryIn-Mobile.html`) ke memori/folder Download HP pengguna.
  - **Panduan Layar HP & QR Code**: Panduan lengkap untuk Android (Chrome) dan iPhone (Safari), beserta *Live QR Code* yang dapat langsung di-scan menggunakan kamera smartphone dari layar komputer.

---

## 🏬 Fitur Inti Lainnya

### 1. 🏪 Pemilihan Supermarket & Kunci Budget (Safety Cap)
- **Supermarket Terfilter per Kota**: Indomaret, Alfamart, Alfamidi, dan Family Mart (khusus Jabodetabek, Surabaya, Bali).
- **Kunci Budget Disiplin**: Nominal uang belanja maksimal dikunci setelah masuk ke tab belanja.

### 2. 🏬 Tab 1: Store (Katalog Belanja)
- Menampilkan foto barang, kategori, harga acuan, harga promo, dan emote fluktuasi harga acuan bulan lalu (🔺 `⬆` Merah Naik, 🔻 `⬇︎` Hijau Turun, ⚖️ `=` Kuning Stabil).

### 3. 🛒 Tab 2: List (Troli Belanja Aktif)
- Format kartu belanja merah:
  - Tombol hapus `✕` (mengembalikan dana ke budget).
  - Tombol edit `✏️ Atur` untuk mengubah satuan, kuantitas, atau diskon.
  - Badges: `[Qty] [Satuan]` dan `Diskon [X]% (-Rp ...)`.
  - Stepper `- [ ] +` dan total harga dalam warna merah cerah.
  - Bottom bar total belanja dengan transisi warna dinamis dan tombol **Checkout**.

### 4. 📜 Tab 3: History & Cetak Struk
- Menyimpan bukti belanjaan dengan nama pelanggan, rincian satuan barang, dan total diskon yang dihemat. Dilengkapi fitur cetak struk kasir (*Printable Receipt*).

---

## 🚀 Cara Menjalankan

1. Buka file `index.html` langsung di browser Anda, atau
2. Jalankan server lokal:
   ```powershell
   node server.js
   ```
3. Buka di browser:
   - Komputer: `http://localhost:3000/`
   - Smartphone (jaringan Wi-Fi sama): `http://[IP-Komputer]:3000/`
4. Jalankan unit test logika:
   ```powershell
   node test.js
   ```
