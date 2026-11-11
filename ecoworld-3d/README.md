# EcoWorld 3D: Bersih Pantai

Game edukasi 3D: kamu relawan yang memungut sampah di pantai, memilahnya di pos daur ulang, lalu naik level sampai pantai bersih. Dibuat dengan Three.js (WebGL) dan Vite.

## Menjalankan dari nol

1. Pasang Node.js versi LTS (18 ke atas) dari https://nodejs.org. Cek dengan `node -v`.
2. Ekstrak zip, lalu buka folder yang langsung berisi `package.json` di VS Code.
3. Buka terminal (Ctrl+`) dan jalankan:

       npm install
       npm run dev

   Di Windows PowerShell yang memblokir skrip, pakai `npm.cmd install` dan `npm.cmd run dev`.
4. Buka alamat yang tampil di terminal, biasanya http://localhost:5173.

Internet hanya dibutuhkan saat `npm install`.

## Kontrol

- Gerak: analog di layar (HP) atau WASD / panah.
- Pungut sampah: tombol Pungut, atau E / Spasi.
- Klik kanan + geser: putar kamera (dua jari di HP). Scroll: zoom.
- Tap di tanah membuat karakter berjalan ke titik itu.

## Isi game

- Sampah berbagai jenis, dengan info bahaya dan manfaat pengolahannya.
- Pos daur ulang untuk memilah dan menjual sampah, koin untuk 4 perlengkapan.
- Pantai ikut berubah saat bersih: air makin jernih, ikan melompat, penyu muncul.
- Hewan: camar, kepiting (menghindar saat didekati), ikan, penyu. Pohon kelapa bergoyang tertiup angin.

## Build

    npm run build

Hasilnya di folder `dist`, bisa diunggah ke GitHub Pages atau Netlify.

## Struktur

    index.html       kerangka halaman (HUD, tombol, kanvas)
    src/main.js      logika game, scene 3D, input
    src/data.js      data sampah, info bahaya/manfaat, perlengkapan
    src/style.css    tampilan antarmuka

Progres tersimpan di localStorage peramban (kunci `ew3`).
