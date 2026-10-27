# GroceryIn - Smart Grocery & Budget Safety Tracker (PWA)

Aplikasi web mobile PWA bergaya *native app* dengan palet warna **Cream / Coklat Muda Estetik**, dirancang khusus untuk seorang **siswa rantau** yang belanja bulanan sambil mendorong troli supermarket.

---

## 🌟 Fitur Utama & Alur Pengguna

### 1. 📱 Format Tampilan Mobile (Rasio 9:16 / 430px : 764px)
- Tampilan aplikasi dirancang khusus mobile UI (maksimal lebar `430px`, rasio 9:16) dan terpusat (*centered*) rapi di layar desktop/laptop dengan frame mockup ponsel pintar.
- **PWA (Progressive Web App)**: Dilengkapi `manifest.json`, icon multi-resolusi, dan Service Worker (`sw.js`) untuk dukungan *Add to Home Screen* dan *offline mode*.

### 2. 🏪 Pemilihan Supermarket & Kunci Budget (Setup Awal)
1. **Pemilihan Daerah & Supermarket**:
   - Pilihan daerah rantau (Bandung, Jabodetabek/Jakarta, Yogyakarta, Surabaya, Malang, Semarang, Medan, Bali).
   - Dropdown supermarket otomatis terfilter sesuai ketersediaan di daerah yang dipilih:
     - **Family Mart** (khusus Jabodetabek, Surabaya, Bali).
     - **Indomaret** & **Alfamart** (tersedia di seluruh daerah).
     - **Alfamidi** (Jabodetabek, Bandung, Yogyakarta, Surabaya, Malang, Medan).
2. **Batas Budget Belanja (Safety Cap)**:
   - Nominal uang maksimal yang menjadi pembatas belanja.
   - **TIDAK BISA DIUBAH** setelah masuk ke tab berbelanja demi menjaga kedisiplinan pengeluaran saku anak rantau.
3. **Tombol "Confirm"**:
   - Mengambil data katalog harga, promo diskon, dan fluktuasi harga acuan bulan lalu dari supermarket yang dipilih.

---

### 3. 🏬 Tab 1: Store (Katalog Belanja)
- Menampilkan barang-barang dalam bentuk *tiles* vertikal yang dapat di-scroll dari atas ke bawah.
- Format kartu produk:
  - **Foto Barang**
  - **Nama Barang**
  - **Harga - Diskon - Harga2 - Emote**:
    - **Harga**: Harga asli (dicoret & berubah abu-abu jika ada diskon).
    - **Diskon**: Persentase potongan (misal: `-15%`, `-20%`).
    - **Harga2**: Harga efektif setelah diskon dengan rumus $\text{Harga2} = \text{Harga} - (\text{Diskon} \times \text{Harga})$.
    - **Emote Fluktuasi vs Bulan Lalu**:
      - 🔺 **`⬆` (Merah)**: Harga produk meningkat dibanding bulan lalu.
      - 🔻 **`⬇︎` (Hijau)**: Harga produk menurun dibanding bulan lalu (pilihan hemat).
      - ⚖️ **`=` (Kuning)**: Harga produk stabil sama dengan bulan lalu.
  - **Tombol "Add to list"**:
    - Memasukkan barang ke troli belanja dan memperbarui sisa budget secara *realtime* di bar atas.
    - **Aturan Budget Habis**: Jika sisa uang saku tidak cukup untuk membeli barang tersebut, barang tidak dapat ditambahkan ke list dan muncul peringatan untuk menghapus barang lain terlebih dahulu.

---

### 4. 🛒 Tab 2: List (Troli Belanja & Ceklis)
- Format kartu belanja:
  ```
  X --------------------
   |Gambar barang| Nama barang
   |             |
   |             | Hargatotal   quantity -[]+
    ---------------------
  ```
  - **X**: Tombol hapus item dari list (mengembalikan uang kembali ke sisa budget).
  - **Hargatotal**: Subtotal harga barang ($\text{Harga2} \times \text{Quantity}$).
  - **Quantity Stepper (`-[]+`)**: Kotak input kuantitas yang dapat diketik langsung maupun dinaik-turunkan dengan tombol minus (`-`) dan plus (`+`).
- **Bottom Bar (Border Hitam, Fading Color & Checkout)**:
  - Di bagian paling bawah terdapat border berwarna hitam yang memunculkan **Total Harga Belanja**.
  - **Transisi Warna (*Fading Color Transition*)**: Semakin dekat total harga dengan batas budget, warna font yang awalnya **Hijau** memudar transisi menjadi **Kuning &rarr; Oranye &rarr; Merah Pekat** saat budget sudah habis.
  - **Tombol "Checkout"**: Mengunci list belanja, menampilkan struk belanja kasir (*Receipt Printable*), mengarsipkan transaksi ke tab History, dan mengosongkan troli aktif.

---

### 5. 📜 Tab 3: History (Riwayat Belanja)
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
- Tersimpan awet di `localStorage` peramban.

---

## 🎨 Palet Warna Cream & Coklat Muda Estetik

| Token | Warna Hex | Deskripsi |
| :--- | :--- | :--- |
| **Background Phone** | `#FAF6F0` | Warm cream estetik |
| **Surface Card** | `#FFFFFF` / `#F5EBE0` | Latte / cream foam |
| **Primary Brown** | `#8C6239` | Coklat karamel hangat |
| **Primary Dark** | `#5E3D21` | Kopi moka pekat |
| **Accent Tan** | `#DDB892` | Pasir keemasan lembut |
| **Text Main** | `#2C221E` | Espresso dark roast |
| **Desktop Canvas** | `#1e1713` | Deep dark roast backdrop |

---

## 🚀 Cara Menjalankan

1. Buka file `index.html` langsung di browser Anda (Chrome, Edge, Safari, Firefox), atau
2. Jalankan server lokal:
   ```powershell
   node server.js
   ```
   Lalu buka URL: `http://localhost:3000/`
