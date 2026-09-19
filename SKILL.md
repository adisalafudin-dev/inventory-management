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
