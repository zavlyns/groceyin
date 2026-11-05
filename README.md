# GroceryIn - Smart Grocery & Budget Safety Tracker (PWA)

Aplikasi web mobile PWA bergaya *native app* dengan tema **Velvet Obsidian & Ruby Crimson**, dirancang khusus untuk seorang **siswa rantau** yang belanja bulanan sambil mendorong troli supermarket.

---

## 🌟 Fitur Utama & Pembaruan Terkini

### 1. ⚡ Checkout Instan Tanpa Pop-up ("Langsung Selesai")
- **Tanpa Dialog Blocking**: Menghapus seluruh konfirmasi native browser `confirm()` dan modal overlay struk kasir yang menghalangi layar saat transaksi.
- **Transisi Mulus**: Saat tombol **Checkout** ditekan, data belanja langsung tersimpan ke riwayat (History) dengan metode pembayaran yang dipilih, keranjang dikosongkan, toast konfirmasi halus muncul, dan tab langsung beralih ke **Riwayat (History)** secara instan.

---

### 2. 💳 Pilihan Metode Pembayaran Kasir Fleksibel
- Pilihan metode pembayaran interaktif langsung di tab Belanja sebelum checkout:
  - 📱 **QRIS** *(Instan / GoPay / OVO / ShopeePay / Livin)*
  - 💵 **Tunai / Cash** *(Uang pas / kasir)*
  - 💳 **BCA** *(BCA Mobile / myBCA / Sakuku)*
  - 🏦 **Mandiri** *(Livin' by Mandiri)*
  - 🏧 **BRI** *(BRImo / Kartu BRI)*
  - 💳 **Kartu Debit / EDC** *(Debit Chip / Flazz / Tap)*
- Metode pembayaran yang dipilih otomatis tercatat di setiap kartu riwayat belanja (History badge) dan struk kasir.

---

### 3. 🎨 Tema Estetik Velvet Obsidian & Ruby Crimson (Nyaman di Mata)
- Palet warna gelap modern berkelas (Dark Slate & Luxury Ruby):
  - **Latar Belakang**: `#0A0D14` (Desktop) & `#10141D` (Mobile Phone) untuk mengurangi silau saat di bawah lampu supermarket.
  - **Permukaan Kartu**: `#171C26` dengan tepi aksen Ruby `#F43F5E` dan kontras teks lembut `#F1F5F9`.
  - **Aksen Tombol & Navigasi**: Gradien Ruby Rose `#E11D48` & `#F43F5E` yang elegan dan ramah jempol.
- **Desain Mobile UI 430px Centered**: Rasio smartphone 9:16 tetap di tengah layar desktop dengan layout sentuhan satu tangan.

---

### 4. 🚦 Tiga Tingkat Status Indikator Budget
- **🟢 HIJAU (Masih Aman)**:
  - Muncul saat pengeluaran belanja masih jauh di bawah batas budget (sisa budget dompet $> 25\%$).
  - Status teks: `✅ Masih Aman (XX% terpakai)`.
- **🟡 KUNING (Warning / Mau Habis)**:
  - Muncul sebagai peringatan dini saat total belanjaan sudah mendekati limit (sisa budget dompet $\le 25\%$, pengeluaran $\ge 75\%$).
  - Status teks: `⚠️ Warning: Budget hampir habis! (XX% terpakai)`.
- **🔴 MERAH (Habis & Kelewatan)**:
  - Muncul saat total belanjaan sudah mencapai atau melampaui sisa budget (sisa budget $\le 0$, pengeluaran $\ge 100\%$).
  - Status teks: `🚨 Budget Habis & Kelewatan (+Rp XXX)!`.

---

### 3. 📏 Pilihan Satuan (Unit) Fleksibel Saat Ditambah ke List
- Saat menekan tombol **"+ Add to list"** pada barang di katalog atau tombol **"✏️ Atur"** pada kartu troli:
  - Pengguna dapat memilih satuan: **`kg`**, **`pcs`**, **`liter`**, **`pack`**, **`botol`**, **`gram`**, **`ml`**, **`ikat`**, atau **`Lainnya...`** (*ketik satuan custom seperti: dus, kaleng, butir, renteng*).
  - Tentukan jumlah kuantitas dengan stepper `− [Qty] +` atau tombol cepat `+1`, `+2`, `+5`.

---

### 4. 🏷️ Pilihan Diskon Bebas & Harga Menyesuaikan
- **Pilihan Preset Diskon**: `0% (Normal)`, `5%`, `10%`, `15%`, `20%`, `25%`, `50%`, atau persentase kustom.
- **Mode Diskon Nominal (Rp)**: Masukkan langsung potongan harga dalam rupiah per satuan (misal: `-Rp 5.000/kg`).
- **Kalkulasi Otomatis (Harga Menyesuaikan Diskon)**:
  - Rumus harga efektif:  
    $$\text{Harga2} = \text{Harga} - (\text{Diskon} \times \text{Harga})$$
  - Menghitung total belanja per item: $\text{Total Item} = \text{Harga2} \times \text{Qty}$.
  - Pengecekan realtime terhadap sisa budget sebelum barang dimasukkan ke list.

---

### 5. 🏬 14 Komoditas Sembako Default & Fluktuasi Harga
1. **Beras 5kg**: Rp 74.000 (bulan lalu Rp 68.000 $\rightarrow$ `⬆` Merah Naik)
2. **Telur 1kg (Tanpa Diskon)**: Rp 28.000 (bulan lalu Rp 32.000 $\rightarrow$ `⬇︎` Hijau Turun)
3. **Garam 500g**: Rp 5.000 (bulan lalu Rp 5.000 $\rightarrow$ `=` Abu-abu Setara)
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

---

### 6. 🏪 Pemilihan Supermarket & Daerah
- Daerah: **Jakarta Barat (Puri Indah)**, **Jabodetabek / Jakarta**, **Bandung**, **Yogyakarta**, **Surabaya**, **Malang**, **Semarang**, **Medan**, **Bali**.
- Supermarket: **Lotte Mart Grocery - Puri Indah**, **Indomaret**, **Alfamart**, **Alfamidi**, dan **Family Mart**.

---

### 7. 🛒 Tab List Belanja (Kartu Berbingkai Merah) & Checkout
- Format kartu list:
  - Indeks urutan item (`Item #1`, `Item #2`).
  - Badge satuan: `[Qty] [Satuan]` (contoh: `2 kg` atau `1 liter`).
  - Badge diskon jika ada potongan.
  - Stepper `- [Qty] +`.
  - Tombol **`✏️ Atur`** untuk mengubah satuan/diskon sewaktu-waktu.
  - Tombol **`✕`** untuk menghapus dan mengembalikan saldo ke budget.
  - Tombol **Checkout** yang mengunci list dan menerbitkan struk kasir (*printable receipt*) ke tab **History**.
