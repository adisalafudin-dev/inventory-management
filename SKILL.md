---
name: design-system
description: Panduan desain UI project ini — warna, spacing, tipografi, komponen shadcn yang dipakai, dan aturan konsistensi visual. WAJIB dipakai setiap kali membuat atau mengubah komponen UI, halaman baru, form, tabel, atau apa pun yang menyangkut tampilan frontend — bahkan kalau user tidak eksplisit minta "sesuai design system".
---

# Design System

Skill ini memastikan agent tidak "mengarang" style baru tiap kali bikin
komponen, dan selalu konsisten sama komponen yang sudah ada.

## Warna (CSS variables — sudah didefinisikan di `src/index.css`)

Jangan pakai hex/rgb literal di komponen. Selalu pakai token berikut lewat
class Tailwind (`bg-primary`, `text-muted-foreground`, dst):

| Token                        | Kegunaan                                          |
| ---------------------------- | ------------------------------------------------- |
| `primary`                    | Aksi utama (tombol submit, link penting)          |
| `secondary`                  | Aksi sekunder                                     |
| `destructive`                | Aksi berbahaya (hapus, batalkan)                  |
| `muted` / `muted-foreground` | Teks/background non-fokus                         |
| `border`                     | Semua border, jangan pakai `border-gray-*` manual |

## Tipografi

- Font: Inter (`@fontsource-variable/inter`), sudah di-load global — jangan import font lain tanpa alasan kuat.
- Heading pakai `text-2xl font-semibold`, `text-xl font-semibold`, dst — jangan bikin ukuran custom di luar skala Tailwind default.

## Spacing & Layout

- Gap antar elemen form: `space-y-4`.
- Padding container halaman: `p-6` (desktop), `p-4` (mobile) — gunakan `p-4 md:p-6`.
- Max width konten utama: `max-w-5xl mx-auto`.

## Komponen — selalu cek `src/components/ui/` dulu sebelum bikin baru

Kalau butuh komponen UI (button, input, dialog, dropdown, dsb), **cek dulu**
apakah sudah ada di `src/components/ui/` (hasil `shadcn add`). Kalau belum
ada, install lewat shadcn — jangan tulis komponen custom dari nol kecuali
benar-benar spesifik dan tidak tersedia di shadcn.

```bash
bunx shadcn@latest add <nama-komponen>
```

Class utility gabungan pakai `cn()` dari `@/lib/utils`, bukan template
string manual:

```tsx
// ✅ benar
className={cn("rounded-md px-4 py-2", isActive && "bg-primary")}

// ❌ salah
className={`rounded-md px-4 py-2 ${isActive ? "bg-primary" : ""}`}
```

## Dark mode

- Semua warna harus lewat token di atas supaya otomatis mengikuti dark mode.
- Jangan hardcode `bg-white` / `bg-black` — pakai `bg-background` / `text-foreground`.

## Icon

- Selalu pakai `lucide-react`, ukuran default `size-4` untuk icon inline di button/input, `size-5` untuk icon berdiri sendiri.

---

_(Update file ini setiap kali ada keputusan desain baru yang disepakati —
misal palet warna final, breakpoint custom, atau komponen baru yang jadi
standar.)_

---

name: page-composition
description: Panduan komposisi halaman penuh (homepage/landing, dashboard, halaman fitur) untuk project Inventory Manager ini, supaya hasilnya terasa dirancang khusus untuk aplikasi manajemen inventori — bukan template SaaS generik. WAJIB dipakai setiap kali membuat halaman baru dari nol (homepage, landing page, dashboard, halaman kosong/empty-state besar) atau merombak layout halaman yang sudah ada. Untuk styling token/warna/komponen individual, itu tetap di skill `design-system` — skill ini fokus ke STRUKTUR & KONTEN halaman.

---

# Page Composition — Menghindari "AI Slop"

Skill ini melengkapi `design-system` (yang ngatur token/komponen). Skill ini
ngatur bagaimana halaman **disusun sebagai satu kesatuan**: hero, urutan
section, copy, dan ritme visual — supaya tidak kelihatan seperti landing
page generik yang bisa dipasang di produk mana saja.

## 1. Pijakan: ini aplikasi buat siapa?

Sebelum bikin halaman apa pun, ingat konteks nyata produk ini:

- **Subjek**: mengelola alat & bahan fisik — gudang, bengkel, lab, koperasi, UMKM. Bukan startup SaaS abstrak.
- **User**: orang yang tiap hari cek stok, catat mutasi barang masuk/keluar, cari lokasi penyimpanan. Bukan investor yang butuh diyakinkan lewat hero besar.
- **Implikasi desain**: halaman utama (setelah login) itu **dashboard kerja**, bukan landing page marketing. Prioritaskan angka-angka penting (total item, item low-stock, mutasi terakhir) di atas, bukan headline besar + ilustrasi.

Kalau yang diminta memang **landing page publik** (sebelum login, buat promosi), baru itu boleh punya hero — tapi headline-nya harus bicara soal masalah nyata ("Berhenti kehilangan jejak stok alat & bahan", bukan "Solusi manajemen inventori terbaik untuk bisnis Anda").

## 2. Ciri "AI slop" yang WAJIB dihindari

Kalau agent bikin halaman dan hasilnya punya salah satu ciri di bawah,
itu tanda sedang jatuh ke default generik — stop dan revisi:

- Hero dengan gradient ungu/biru + headline generik ("Kelola Inventori Anda dengan Mudah") + ilustrasi 3D generik.
- Semua card fitur berbentuk sama persis, border-radius sama, shadow abu-abu lembut yang sama, isinya cuma icon + judul + 1 kalimat kosong.
- Label ALL-CAPS di atas tiap heading ("FITUR UNGGULAN", "KENAPA KAMI").
- Angka bertitik ("01 · 02 · 03") padahal isinya bukan urutan/langkah.
- Tombol CTA generik: "Get Started", "Learn More", "Submit" — tanpa bilang aksi konkret apa yang terjadi.
- Copy placeholder yang gak spesifik ke konteks inventori ("Lorem ipsum", "Fitur A membantu Anda melakukan X dengan mudah").
- Section yang jumlahnya "pas 3" atau "pas 4" karena itu default (Fitur, Testimoni, Harga, CTA) padahal produk ini belum tentu butuh semua itu.

## 3. Struktur per jenis halaman

### Dashboard (halaman utama setelah login)

Urutan prioritas berdasarkan apa yang user butuh lihat PERTAMA:

1. **Ringkasan angka** — total item, item dengan stok menipis, jumlah lokasi/kategori aktif. Ambil dari `/dashboard/summary`.
2. **Aksi cepat** — tombol tambah item, catat mutasi, bukan disembunyikan di menu.
3. **Aktivitas terbaru** — beberapa `LogMutasi` terakhir, bukan tabel penuh (link ke halaman detail).
4. Jangan taruh grafik/chart hias yang gak dari data asli. Kalau belum ada data chart yang relevan, skip — jangan taruh chart kosong/dummy.

### Halaman list (Kategori, Lokasi, Alat Bahan, Tag)

- Tabel/list adalah konten utama, bukan card grid dekoratif.
- Selalu sediakan: search/filter, empty state yang actionable ("Belum ada kategori. Tambah kategori pertama untuk mulai mengelompokkan barang."), dan pagination kalau datanya panjang.
- Aksi (edit/hapus) langsung terlihat di row, jangan disembunyikan di balik banyak klik.

### Landing/marketing page (kalau memang diminta terpisah, publik)

- 1 hero dengan headline spesifik ke masalah nyata inventori fisik (kehilangan barang, salah catat stok manual, dsb) — bukan klaim generik.
- Section fitur secukupnya sesuai fitur yang **benar-benar ada** (lihat AGENTS.md API Reference: kategori, lokasi, alat-bahan, mutasi, tag, dashboard, export CSV) — jangan mengarang fitur yang belum dibangun.
- Boleh 1 momen visual yang jadi fokus (misal: preview tabel mutasi asli, bukan ilustrasi abstrak), sisanya tenang.

## 4. Copy — tulis dari sudut pandang user gudang, bukan marketing

- Nama aksi konsisten dengan istilah yang sudah dipakai di data model: "Kategori", "Lokasi Penyimpanan", "Alat Bahan", "Mutasi Stok" — jangan ganti-ganti istilah ("Barang" vs "Item" vs "Produk") di halaman berbeda.
- Tombol bilang aksi konkret: "Simpan Kategori", "Catat Mutasi", "Export ke CSV" — bukan "Submit"/"Kirim".
- Empty state kasih instruksi jelas apa yang harus dilakukan, bukan cuma "Data tidak ditemukan".
- Pesan error dari backend (lihat format response di AGENTS.md) ditampilkan apa adanya atau diterjemahkan singkat — jangan diganti jadi pesan generik "Terjadi kesalahan".

## 5. Motion & visual — secukupnya

- Transisi hover pada row/card boleh, tapi jangan animasi fade-slide-up di tiap section saat scroll — itu ciri khas AI slop.
- Warna & komponen tetap ikut token dari skill `design-system` (jangan bikin palet baru per halaman).
- Kalau ada 1 elemen yang layak jadi fokus visual (misal angka ringkasan dashboard), buat itu jelas lebih menonjol — jangan semua elemen sama beratnya.

## 6. Sebelum selesai — self-check

Sebelum menganggap halaman selesai, cek ulang dengan `references/quality-checklist.md`.
