# 📦 Backend Sistem Manajemen Inventaris Elektronik

Backend API untuk manajemen komponen elektronik, sensor, dan perkakas laboratorium. Dibangun menggunakan arsitektur modern berbasis **Bun**, **NestJS**, dan **Prisma ORM (v8)** dengan database **PostgreSQL/MySQL**.

## 🚀 Fitur Tersedia (Core Features)

- [x] **Autentikasi Aman:** Login/Register dengan JWT dan hashing password menggunakan `Bun.password` native.
- [x] **Manajemen Master Data:** CRUD Kategori, Lokasi Penyimpanan, dan Sistem Label (Tags).
- [x] **Manajemen Alat & Bahan:** Pencatatan stok komponen fisik.
- [x] **Sistem Log Mutasi (Atomik):** Menggunakan _Interactive Transactions_ Prisma (`tx`) untuk menjamin konsistensi saat stok keluar/masuk.
- [x] **Dashboard Analytics:** Endpoint statistik ringkasan (total barang, stok menipis, barang rusak, aktivitas terakhir) yang dioptimasi dengan `Promise.all()`.
- [x] **Konsistensi Respons:** Implementasi Global Interceptor dan Global Exception Filter untuk standarisasi format JSON.
- [x] **Export Data:** Endpoint untuk mengunduh laporan stok dalam format CSV.

---

## 🛠️ Rekomendasi Improvisasi (Best Practice Improvements)

Meskipun sistem inti sudah berjalan, berikut adalah 4 improvisasi _best practice_ yang direkomendasikan sebelum di-deploy ke server publik:

### 1. Dokumentasi API Otomatis (Swagger/OpenAPI)

Saat ini frontend developer (atau Anda di masa depan) harus melihat kode untuk mengetahui _endpoint_ apa saja yang tersedia. NestJS memiliki integrasi Swagger bawaan.

- **Tindakan:** Instal `@nestjs/swagger`.
- **Implementasi:** Tambahkan dekorator seperti `@ApiTags()`, `@ApiOperation()`, dan `@ApiResponse()` di setiap Controller. Ini akan otomatis men-generate halaman dokumentasi interaktif (biasanya di `localhost:3000/api`).

### 2. Security Hardening (Helmet & Rate Limiting)

Meskipun sudah ada JWT, API Anda masih rentan terhadap _Brute-Force Attack_ (mencoba login ribuan kali per detik) dan celah _header_ HTTP.

- **Tindakan:**
  - Instal `helmet` (middleware untuk mengamankan HTTP headers).
  - Instal `@nestjs/throttler` (untuk Rate Limiting).
- **Implementasi di `main.ts`:**
  ```typescript
  import helmet from 'helmet';
  // ...
  app.use(helmet()); // Mencegah celah XSS dasar
  Implementasi Rate Limiter: Batasi endpoint /auth/login maksimal 5 request per 1 menit per IP.
  ```

3. Validasi Environment Variables (ConfigModule)
   Jika aplikasi di-deploy tapi Anda lupa memasukkan DATABASE_URL atau JWT_SECRET di server, aplikasi akan mati (crash) dengan pesan error yang membingungkan.

Tindakan: Instal joi atau gunakan validasi bawaan @nestjs/config.

Implementasi: Validasi file .env saat aplikasi di-bootstrap. Jika JWT_SECRET tidak ada, aplikasi menolak menyala dan memberikan error log yang jelas di terminal.

4. Application Logging (Pino / Winston)
   Saat ini, Global Exception Filter mengembalikan format error yang rapi ke frontend, tetapi bagaimana cara Anda (sebagai backend developer) melacak error 500 (Internal Server Error) di server? NestJS logger bawaan akan hilang saat terminal ditutup.

Tindakan: Integrasikan nestjs-pino atau winston.

Implementasi: Simpan log error penting ke dalam file (misal: error-2026-09-14.log) atau kirim ke layanan pemantauan (seperti Sentry) agar Anda tahu jika ada transaksi mutasi stok yang gagal di production.

5. Database Seeding (Seed Script)
   Saat menginstal ulang proyek atau berpindah komputer, database akan kosong.

Tindakan: Buat file prisma/seed.ts.

Implementasi: Tulis script untuk otomatis membuat User admin default dan Kategori standar (seperti "Mikrokontroler", "Resistor", "Kabel") saat perintah bun prisma db seed dijalankan.

💻 Tahap Selanjutnya: Integrasi Frontend
Backend sudah siap dikonsumsi. Langkah selanjutnya adalah membangun antarmuka pengguna:

Inisialisasi proyek Next.js atau React (Vite).

Setup Shadcn UI & Tailwind CSS.

Buat API Client menggunakan Axios atau Fetch dengan interceptor untuk menyisipkan token JWT secara otomatis ke dalam Header Authorization setiap kali memanggil API ini.
