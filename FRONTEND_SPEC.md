# FRONTEND_SPEC.md — Inventory Manager

> Dokumen arah desain untuk frontend project ini. Beda sama `SKILL.md`
> (design-system) yang isinya ATURAN pemakaian token — file ini isinya
> KEPUTUSAN desain: kenapa palet ini dipilih, dan nilai konkretnya.
> Sekali disepakati, salin token warnanya ke `src/index.css` dan
> `SKILL.md` cukup rujuk ke sini kalau ada yang tanya "kenapa warnanya
> begini".

---

## 1. Konteks & Alasan Arah Desain

Ini bukan aplikasi SaaS abstrak — ini alat kerja harian untuk orang yang
mengelola barang fisik: alat, bahan, lokasi rak, mutasi stok masuk/keluar.
Dipakai berulang kali sehari, sering di device yang gak selalu premium
(warehouse, bengkel, gudang UMKM), bukan dilihat sekali untuk "wow factor".

Implikasi ke desain:

- **Keterbacaan data lebih penting dari estetika dekoratif.** Angka stok, kode item, tanggal mutasi harus gampang dipindai cepat.
- **Kontras dan status visual jelas** — item dengan stok menipis atau kondisi rusak harus langsung kelihatan tanpa harus baca teks.
- **Warna terinspirasi dari dunia gudang/bengkel yang sebenarnya** (label rak, tag alat, penanda lokasi) — bukan palet SaaS generik (ungu-biru gradient, atau cream+terracotta ala AI-generated default).

---

## 2. Palet Warna

Arah: **"Workshop Ledger"** — dasar netral hangat seperti kertas catatan
gudang, aksen amber/ochre seperti warna label & tag alat fisik, biru-abu
gelap untuk struktur (mengacu warna seragam/rak besi). Bukan warna
"teknologi", tapi warna dunia kerja nyata.

### Light mode

| Token                  | Hex       | Kegunaan                                                                  |
| ---------------------- | --------- | ------------------------------------------------------------------------- |
| `background`           | `#F7F5F1` | Latar utama — putih hangat, bukan putih steril                            |
| `foreground`           | `#22201C` | Teks utama, hampir hitam tapi hangat                                      |
| `card`                 | `#FFFFFF` | Permukaan card/tabel, kontras tipis dari background                       |
| `primary`              | `#B5762A` | Aksi utama (tombol simpan, link penting) — amber/ochre seperti tag gudang |
| `primary-foreground`   | `#FFFBF5` | Teks di atas primary                                                      |
| `secondary`            | `#2E3A46` | Aksi sekunder, header, navigasi — biru-abu gelap seragam kerja            |
| `secondary-foreground` | `#F7F5F1` | Teks di atas secondary                                                    |
| `muted`                | `#EAE6DE` | Background non-fokus (baris zebra tabel, section pemisah)                 |
| `muted-foreground`     | `#6B655C` | Teks sekunder, label, placeholder                                         |
| `border`               | `#DDD7CC` | Semua border/divider                                                      |
| `destructive`          | `#B23A2E` | Aksi berbahaya (hapus, stok hilang)                                       |
| `success`              | `#4B7357` | Stok masuk, status "Baik"                                                 |
| `warning`              | `#C08A1E` | Stok menipis, perlu perhatian                                             |

### Dark mode

| Token                  | Hex       | Kegunaan                                             |
| ---------------------- | --------- | ---------------------------------------------------- |
| `background`           | `#1C1A17` | Latar utama, coklat-hitam hangat                     |
| `foreground`           | `#EDE9E2` | Teks utama                                           |
| `card`                 | `#25221E` | Permukaan card, sedikit lebih terang dari background |
| `primary`              | `#D69A4E` | Amber lebih terang biar kontras cukup di dark mode   |
| `primary-foreground`   | `#1C1A17` | Teks di atas primary                                 |
| `secondary`            | `#3C4A58` |                                                      |
| `secondary-foreground` | `#EDE9E2` |                                                      |
| `muted`                | `#2E2B26` |                                                      |
| `muted-foreground`     | `#A89F92` |                                                      |
| `border`               | `#3A362F` |                                                      |
| `destructive`          | `#D9584A` |                                                      |
| `success`              | `#6FA07E` |                                                      |
| `warning`              | `#DDA83D` |                                                      |

### Implementasi — `frontend/src/index.css`

Tailwind v4 + shadcn pakai CSS variable di `@theme`. Tambahkan/ganti
block berikut (sesuaikan kalau `index.css` sudah punya struktur beda):

```css
@import "tailwindcss";

:root {
  --background: #f7f5f1;
  --foreground: #22201c;
  --card: #ffffff;
  --card-foreground: #22201c;
  --primary: #b5762a;
  --primary-foreground: #fffbf5;
  --secondary: #2e3a46;
  --secondary-foreground: #f7f5f1;
  --muted: #eae6de;
  --muted-foreground: #6b655c;
  --border: #ddd7cc;
  --destructive: #b23a2e;
  --destructive-foreground: #fffbf5;
  --success: #4b7357;
  --success-foreground: #fffbf5;
  --warning: #c08a1e;
  --warning-foreground: #22201c;
  --radius: 0.5rem;
}

.dark {
  --background: #1c1a17;
  --foreground: #ede9e2;
  --card: #25221e;
  --card-foreground: #ede9e2;
  --primary: #d69a4e;
  --primary-foreground: #1c1a17;
  --secondary: #3c4a58;
  --secondary-foreground: #ede9e2;
  --muted: #2e2b26;
  --muted-foreground: #a89f92;
  --border: #3a362f;
  --destructive: #d9584a;
  --destructive-foreground: #1c1a17;
  --success: #6fa07e;
  --success-foreground: #1c1a17;
  --warning: #dda83d;
  --warning-foreground: #1c1a17;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --radius-lg: var(--radius);
}
```

> `success` dan `warning` bukan token bawaan shadcn — perlu ditambah manual
> seperti di atas supaya bisa dipakai sebagai `bg-success`, `text-warning`, dst.
> Dipakai khusus untuk status stok (Baik/Rusak/Hilang, stok menipis).

**Pemetaan status data ke warna** (untuk `KondisiBarang` dan level stok):

| Status                            | Token                                                                       |
| --------------------------------- | --------------------------------------------------------------------------- |
| Kondisi: Baik                     | `success`                                                                   |
| Kondisi: Rusak                    | `warning`                                                                   |
| Kondisi: Hilang                   | `destructive`                                                               |
| Stok cukup                        | `muted-foreground` (netral, gak perlu highlight)                            |
| Stok menipis (di bawah threshold) | `warning` + badge                                                           |
| Mutasi masuk                      | `success`                                                                   |
| Mutasi keluar                     | `secondary` atau netral, bukan destructive (keluar itu normal, bukan error) |

_(Sesuaikan nama enum di atas dengan nilai asli `KondisiBarang`/`TipeMutasi` di `schema.prisma` — tabel ini contoh pemetaan, bukan nilai enum literal.)_

---

## 3. Tipografi

- **UI & body text**: Inter (`@fontsource-variable/inter`, sudah terpasang) — tetap dipakai, jangan ganti. Ini pilihan yang tepat untuk aplikasi data-dense: netral, sangat legible di ukuran kecil.
- **Data numerik & kode** (kuantitas stok, ID item, tanggal di tabel): tambahkan font monospace **khusus untuk data**, bukan dekorasi — supaya angka rata secara visual di kolom tabel dan gampang dibandingkan sekilas.

  ```bash
  bun add @fontsource/jetbrains-mono
  ```

  Pakai lewat class utility, contoh di komponen tabel:

  ```tsx
  <span className="font-mono tabular-nums">{item.kuantitas}</span>
  ```

  Tambahkan di `tailwind` lewat `@theme`:

  ```css
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  ```

- **Skala heading** — tetap ikuti skala default Tailwind, jangan bikin ukuran custom:
  - Halaman/section title: `text-2xl font-semibold`
  - Card/subsection title: `text-lg font-semibold`
  - Body: `text-sm` (data-dense app, `text-base` kepenuhan untuk tabel dengan banyak baris)
  - Label/caption: `text-xs text-muted-foreground`

---

## 4. Layout & Spacing

- **Struktur utama**: sidebar navigasi tetap (kategori, lokasi, alat bahan, mutasi, tag, dashboard) + konten utama, bukan navigasi top-bar horizontal — aplikasi kerja harian lebih nyaman dengan sidebar yang selalu terlihat.
- **Densitas tabel**: baris tabel `h-10` sampai `h-12`, padding sel `px-3 py-2` — jangan terlalu lega (`py-4`+) karena user akan scroll banyak data.
- **Container halaman**: `p-4 md:p-6`, tanpa `max-w` yang membatasi terlalu sempit — tabel data butuh lebar penuh, beda dari landing page yang biasanya `max-w-5xl`.
- **Card ringkasan dashboard**: grid `grid-cols-2 md:grid-cols-4`, tiap card fokus ke satu angka besar (`text-3xl font-mono font-semibold`) + label kecil di bawahnya — bukan card dengan icon besar + deskripsi panjang.

---

## 5. Ikonografi

- Tetap `lucide-react` (sudah di `SKILL.md`).
- Ikon status kondisi barang pakai bentuk yang jelas beda, bukan cuma beda warna (untuk aksesibilitas — jangan andalkan warna saja):
  - Baik → `CircleCheck`
  - Rusak → `TriangleAlert`
  - Hilang → `CircleX`
- Ikon mutasi: masuk → `ArrowDownToLine`, keluar → `ArrowUpFromLine` (bukan panah generik kiri-kanan).

---

## 6. Motion

- Transisi hover pada row tabel & card: `transition-colors duration-150`, itu saja.
- Toast notifikasi (`sonner`) untuk konfirmasi aksi (simpan, hapus, mutasi tercatat) — jangan animasi tambahan di luar itu.
- Tidak ada animasi scroll-reveal di halaman dashboard/list (itu ciri landing page marketing, bukan alat kerja).

---

## 7. Kalau Nanti Ada Landing Page Publik Terpisah

Palet & tipografi tetap sama (konsistensi brand), tapi layoutnya boleh
lebih longgar (`max-w-5xl`, spacing lebih lega) karena tujuannya beda:
meyakinkan calon user, bukan kerja harian. Rujuk `page-composition` skill
untuk struktur & copy-nya.

---

_(Dokumen ini keputusan desain final sampai direvisi. Kalau palet/font
berubah, update file ini DAN section warna di `SKILL.md` di commit yang
sama — jangan biarkan dua file itu beda isi.)_
