# 📦 Backend Sistem Manajemen Inventaris Elektronik

Backend API untuk manajemen komponen elektronik, sensor, dan perkakas laboratorium. Dibangun dengan arsitektur modern berbasis **Bun**, **NestJS**, dan **Prisma ORM v8**, dengan dukungan database **PostgreSQL/MySQL**.

## Fitur yang Sudah Tersedia

- **Autentikasi Aman** — Login dan registrasi menggunakan JWT, dengan hashing password native melalui `Bun.password`.
- **Manajemen Master Data** — CRUD lengkap untuk Kategori, Lokasi Penyimpanan, dan Sistem Label (Tags).
- **Manajemen Alat & Bahan** — Pencatatan dan pelacakan stok komponen fisik.
- **Sistem Log Mutasi (Atomik)** — Menggunakan _interactive transactions_ Prisma (`tx`) untuk menjamin konsistensi data saat stok masuk/keluar.
- **Dashboard Analytics** — Endpoint statistik ringkasan (total barang, stok menipis, barang rusak, aktivitas terbaru), dioptimasi dengan `Promise.all()`.
- **Konsistensi Respons API** — Global Interceptor dan Global Exception Filter untuk standarisasi format JSON di seluruh endpoint.
- **Export Data** — Endpoint untuk mengunduh laporan stok dalam format CSV.

## Rekomendasi Peningkatan Sebelum Deploy

Lima area berikut direkomendasikan untuk diperkuat sebelum sistem dirilis ke server publik.

### 1. Dokumentasi API Otomatis (Swagger/OpenAPI)

Saat ini, memahami endpoint yang tersedia mengharuskan pembacaan langsung ke source code. NestJS memiliki integrasi Swagger bawaan yang dapat menghasilkan dokumentasi interaktif secara otomatis.

**Rencana implementasi:**

- Instal `@nestjs/swagger`.
- Tambahkan dekorator `@ApiTags()`, `@ApiOperation()`, dan `@ApiResponse()` di setiap controller.
- Dokumentasi interaktif akan tersedia di `localhost:3000/api`.

### 2. Security Hardening (Helmet & Rate Limiting)

JWT saja tidak cukup untuk melindungi API dari serangan brute-force pada endpoint autentikasi maupun celah keamanan pada HTTP header.

**Rencana implementasi:**

- Instal `helmet` untuk mengamankan HTTP header secara default.
- Instal `@nestjs/throttler` untuk rate limiting.
- Batasi endpoint `/auth/login` maksimal 5 permintaan per menit per alamat IP.

```typescript
import helmet from "helmet";

app.use(helmet()); // mencegah celah XSS dasar
```

### 3. Validasi Environment Variables

Kegagalan menyertakan variabel seperti `DATABASE_URL` atau `JWT_SECRET` saat deployment sebaiknya menghasilkan pesan error yang jelas, bukan crash tanpa konteks.

**Rencana implementasi:**

- Terapkan validasi environment variable melalui `@nestjs/config` (built-in validation) atau `joi`.
- Aplikasi harus menolak untuk start dan menampilkan log error yang eksplisit apabila variabel wajib tidak ditemukan.

### 4. Application Logging

Global Exception Filter saat ini sudah mengembalikan format error yang rapi ke frontend, namun error tersebut perlu tetap tercatat secara permanen di sisi server untuk keperluan audit dan debugging produksi.

**Rencana implementasi:**

- Integrasikan `nestjs-pino` atau `winston`.
- Simpan log error penting ke file (misalnya `error-2026-09-14.log`) atau kirim ke layanan pemantauan seperti Sentry, khususnya untuk transaksi mutasi stok yang gagal di production.

### 5. Database Seeding

Instalasi ulang proyek atau perpindahan environment pengembangan saat ini menghasilkan database kosong tanpa data awal.

**Rencana implementasi:**

- Buat script `prisma/seed.ts`.
- Script secara otomatis membuat user admin default dan kategori standar (misalnya "Mikrokontroler", "Resistor", "Kabel") saat perintah `bun prisma db seed` dijalankan.

## Tahap Selanjutnya: Integrasi Frontend

Backend sudah siap dikonsumsi. Tahap berikutnya adalah membangun antarmuka pengguna.

**Setup awal:**

- Inisialisasi proyek React (Vite).
- Setup shadcn/ui dan Tailwind CSS.
- Buat API client menggunakan Axios dengan interceptor untuk menyisipkan token JWT secara otomatis ke header `Authorization` di setiap pemanggilan API.

**Roadmap state management:**

| Task                      | Deskripsi                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Buat UI Store             | Setup state global untuk mengatur buka-tutup modal pencarian (`Ctrl+K`)                                        |
| Terapkan UI Store         | Hubungkan state pencarian dengan tombol di header dan event listener keyboard                                  |
| Buat Mutasi Store         | Setup state draf keranjang mutasi sementara untuk menampung beberapa komponen sebelum dikirim ke API           |
| Terapkan Mutasi Store     | Hubungkan tombol aksi di tabel barang dengan keranjang mutasi                                                  |
| Buat Preference Store     | Setup state dengan fitur persist untuk menyimpan pengaturan tampilan (Tabel/Grid) dan filter ke `localStorage` |
| Terapkan Preference Store | Hubungkan state preferensi dengan UI halaman Inventaris agar pengaturan pengguna tidak hilang saat refresh     |
| Sidebar State Store       | Simpan status buka/tutup sidebar agar konsisten antar sesi                                                     |
