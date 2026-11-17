# Pie × Ryf — Roblox Diary

Website statis bertema crimson untuk GitHub Pages. Dibuat dengan HTML, CSS, dan JavaScript murni — tidak perlu build tools atau framework.

## Preview lokal
Buka `index.html` langsung di browser, atau jalankan local server:
```bash
python -m http.server 8000
```
Lalu buka http://localhost:8000.

## Publish ke GitHub Pages
1. Buat repository baru di GitHub.
2. Upload seluruh isi folder ini (pastikan `index.html` ada di root repository).
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main`, folder `/ (root)`, lalu klik **Save**.
6. Tunggu beberapa menit; URL website akan muncul di bagian Pages.

## Personalisasi
- Ubah nama, intro, dan teks di `index.html`.
- Ganti gambar placeholder album dengan screenshot sendiri: simpan gambar di `assets/images/`, lalu edit tiap elemen `.memory-art` di `index.html` menjadi misalnya:
  ```html
  <div class="memory-art" style="background-image:url('assets/images/gameplay-1.jpg'); background-size:cover; background-position:center"></div>
  ```
- Edit daftar makanan di bagian `#food`.
- Edit nama dan kode warna di bagian `#colors`; sesuaikan warna swatch di `assets/css/style.css`.
- Tambahkan style lain dengan menyalin salah satu kartu di bagian `#styles`.

## Struktur
```text
roblox-crimson-duo/
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── images/
```

Catatan: Google Fonts memerlukan koneksi internet. Jika offline, website tetap berjalan dengan font fallback.


## Update: Pie × Ryf page-change avatar animation

- Added a small Pie and Ryf companion pair that slides in whenever a page is opened.
- The pair gently floats while the page is active.
- The animation respects the device's reduced-motion setting.
- Desktop shows the duo along the right side; mobile places the smaller pair above the bottom navigation.
- Uses the existing individual avatar portraits in `assets/images/avatars/` to preserve their original appearance. The full-body sunset reference was not cut out because an automatic cutout would risk damaging the avatars' edges and details.

### Files changed
- `index.html` — added the companion widget.
- `assets/css/style.css` — added the slide-in and floating styles.
- `assets/js/main.js` — replays the entrance animation on every page change.

Replace these three files in an existing copy of the site, or extract this ZIP as the project copy. Keep the `assets/images/avatars/pie.jpg` and `assets/images/avatars/ryf.jpg` files in their existing paths.
