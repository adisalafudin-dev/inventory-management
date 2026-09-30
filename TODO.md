# Backend Sistem Manajemen Inventaris

## Fitur End User / Production

- [x] Autentikasi Aman — Login dan registrasi menggunakan JWT, dengan hashing password native melalui `Bun.password`.
- [x] Manajemen Master Data — CRUD lengkap untuk Kategori, Lokasi Penyimpanan, dan Sistem Label (Tags).
- [x] Manajemen Alat & Bahan — Pencatatan dan pelacakan stok komponen fisik.
- [x] Sistem Log Mutasi (Atomik) — Menggunakan _interactive transactions_ Prisma (`tx`) untuk menjamin konsistensi data saat stok masuk/keluar.
- [x] Dashboard Analytics — Endpoint statistik ringkasan (total barang, stok menipis, barang rusak, aktivitas terbaru), dioptimasi dengan `Promise.all()`.
- [x] Konsistensi Respons API — Global Interceptor dan Global Exception Filter untuk standarisasi format JSON di seluruh endpoint.
- [x] Export Data — Endpoint untuk mengunduh laporan stok dalam format CSV.
- [ ] Autentikasi Google - Auth google dengan OAuth 2.0 dan Passport JS

## Fitur Development

- [x] **Dokumentasi API Otomatis (Swagger/OpenAPI)** — Terpasang `@nestjs/swagger` dengan dekorator `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` di controller. Tersedia di `/api` (Swagger UI) dan `/reference` (Scalar API Reference).
- [ ] **Security Hardening (Helmet & Rate Limiting)** — Instal `helmet` untuk mengamankan HTTP header, dan `@nestjs/throttler` untuk membatasi endpoint `/auth/login` maksimal 5 permintaan per menit per IP.
- [x] **Validasi Environment Variables** — Validasi `.env` (`DATABASE_URL`, `JWT_SECRET`, dst) sudah diterapkan lewat `ConfigModule` + fungsi `validate` kustom; aplikasi menolak start dan menampilkan error log yang jelas bila variabel wajib tidak ditemukan.
- [x] **Application Logging** — Terintegrasi dengan `nestjs-pino`; Global Exception Filter mencatat error lengkap (termasuk stack trace untuk error 500) ke log terstruktur JSON.
- [ ] **Backend Testing** — `@nestjs/testing` + `supertest`, database test terpisah (Docker Postgres).
  - [ ] Setup test runner (pastikan kompatibel dengan `Bun.password` dan decorator metadata).
  - [ ] Unit test service mutasi: stok tidak boleh negatif, rollback saat transaksi gagal.
  - [ ] Test race condition: dua stok keluar bersamaan pada item yang sama.
  - [ ] Test kepemilikan data: user A tidak bisa akses data user B.
  - [ ] Test auth: login salah, token invalid/expired.
  - [ ] E2E: alur login → buat item → mutasi → cek dashboard.

## Prioritas 8 Hal Berikutnya

Urutan pengerjaan; detail tiap item ada di section masing-masing.

1. `ValidationPipe` mode ketat (Security Standar Produksi)
2. Helmet + rate limit login (Fitur Development)
3. CORS ketat (Security Standar Produksi)
4. Refresh token + access token pendek (Security Standar Produksi)
5. Request ID + log redaction (Monitoring Fase 2)
6. `/health` + Sentry (Monitoring Fase 1)
7. Idempotency pada mutasi stok (Keandalan Data)
8. CI GitHub Actions (Standar API & Proyek)

## Security Standar Produksi

### Wajib

- [ ] **ValidationPipe Ketat** — Global `ValidationPipe` dengan `whitelist: true` dan `forbidNonWhitelisted: true` agar field tak dikenal dibuang/ditolak (cegah mass-assignment, misal `role` atau `userId` orang lain).
- [ ] **CORS Ketat** — Izinkan hanya domain frontend; jangan pakai `*` di production.
- [ ] **Access Token Pendek + Refresh Token** — Access token ±15 menit; refresh token disimpan ter-hash di database supaya bisa dicabut saat logout atau ganti password.
- [ ] **Error Login Generik** — Selalu balas "email atau password salah", jangan bocorkan apakah email terdaftar.
- [ ] **Batas Maksimal Pagination** — Batasi `limit` (misal max 100) di semua endpoint list.
- [ ] **Secrets Hygiene** — `.env` masuk `.gitignore`, commit `.env.example`, `JWT_SECRET` acak dan panjang.
- [ ] **Respons 500 Generik** — Client hanya menerima pesan umum; stack trace lengkap hanya di log (sudah ada di Exception Filter, verifikasi saja).

### Bagus Dimiliki

- [ ] **Keputusan Penyimpanan Token Frontend** — Pilih `localStorage` atau httpOnly cookie; catat trade-off XSS vs CSRF di catatan keputusan.
- [ ] **Audit Log Event Sensitif** — Login, login gagal, hapus data, perubahan hak akses (perluas ide dari log mutasi).
- [ ] **Dependency Scanning** — Aktifkan Dependabot di GitHub dan jalankan `npm audit` di CI.
- [ ] **Role & Guard (RBAC)** — Hanya jika nanti ada lebih dari satu jenis user.

## Kemudahan Debugging

> Request ID dan redaction log sudah ada di **Monitoring Fase 2**.

- [ ] **Header `X-Request-Id`** — Sertakan di response header dan body error agar user bisa melapor dengan ID untuk dicari di log.
- [ ] **Kode Error Konsisten** — Format `{ code: "INSUFFICIENT_STOCK", message: "..." }` supaya frontend bisa bereaksi berdasarkan kode dan log mudah dicari.
- [ ] **Slow Query Logging** — Aktifkan event query Prisma, catat query > ±200ms untuk menangkap N+1 lebih awal.
- [ ] **Log Level via Env** — `debug` di development, `info` di production; `pino-pretty` hanya di development.
- [ ] **Graceful Shutdown** — `app.enableShutdownHooks()` agar koneksi Prisma ditutup rapi saat deploy/restart.

## Keandalan Data

- [ ] **Idempotency Mutasi Stok** — Cegah klik ganda mencatat dua mutasi: `Idempotency-Key` header dan/atau kunci submit di frontend.
- [ ] **Constraint di Database** — Misal `CHECK (stock >= 0)`, agar data tetap valid walau ada bug di kode.
- [ ] **Migrasi Production** — Gunakan `prisma migrate deploy`, jangan `db push`.
- [ ] **Soft Delete** — Untuk item yang punya riwayat mutasi, supaya riwayat tidak hilang atau yatim.
- [ ] **Kolom Audit Standar** — `createdAt`, `updatedAt`, `createdBy`/`updatedBy` di tabel utama.
- [ ] **Backup + Uji Restore** — Jadwalkan `pg_dump`, lalu lakukan satu kali restore drill sungguhan.

## Standar API & Proyek

- [ ] **Versioning API** — Prefix route `/v1` sekarang, sebelum ada client lain.
- [ ] **Format Pagination/Sort/Filter Seragam** — Satu konvensi untuk semua endpoint list.
- [ ] **CI GitHub Actions** — Lint, typecheck, dan test otomatis di setiap push.
- [ ] **ESLint, Prettier, Husky + commitlint** — Format kode dan gaya commit konsisten.
- [ ] **docker-compose + Seed Script** — Clone baru bisa jalan dengan satu perintah.
- [ ] **README + Catatan Keputusan (ADR)** — Langkah setup, variabel env, arsitektur, dan alasan pilihan (misal kenapa `Bun.password`).

## Monitoring system

### Fase 1 — Wajib

- [ ] **Health Check** — Endpoint `/health` dengan `@nestjs/terminus`, cek koneksi database via Prisma.
- [ ] **Uptime Monitoring** — Uptime Kuma/UptimeRobot memantau `/health` dari luar server, alert ke Telegram/Discord.
- [ ] **Error Tracking Backend** — Sentry di NestJS, tangkap error 500 beserta stack trace.
- [ ] **Error Tracking Frontend** — Sentry di React (Vite) untuk error JS di browser user.

### Fase 2 — Operasional

- [ ] **Request ID & Log Redaction** — Request ID di setiap log, sembunyikan header `Authorization` dan field password di pino.
- [ ] **Monitoring Resource Server** — Netdata/Beszel untuk CPU, RAM, disk; alert saat disk > 80%.
- [ ] **Monitoring Backup** — Heartbeat/push monitor supaya ketahuan kalau backup gagal.

### Fase 3 — Lanjutan

- [ ] **Metrics** — `/metrics` (prom-client) + Prometheus + Grafana (request rate, latency, error rate).
- [ ] **Analytics Pengunjung** — Umami/Plausible self-hosted.

# Integrasi Frontend Sistem Manajemen Inventaris Elektronik

## Setup Awal

- [x] Inisialisasi proyek React (Vite).
- [x] Setup shadcn/ui dan Tailwind CSS.
- [x] Buat API client menggunakan Axios dengan interceptor untuk menyisipkan token JWT secara otomatis ke header `Authorization` di setiap pemanggilan API.

## CRUD Frontend

- [x] Kategori — List (search + pagination), create, update, delete dengan validasi kepemilikan per user.
- [ ] Lokasi Penyimpanan — List, create, update, delete.
- [ ] Alat & Bahan — List, create, update, delete, plus form tambah/kurang stok.
- [ ] Tag — List, create, update, delete, dan relasi tag ke item inventori.
- [ ] Riwayat Mutasi — List dengan filter dan pagination.

## Roadmap State Management

- [ ] Buat UI Store — Setup state global untuk mengatur buka-tutup modal pencarian (`Ctrl+K`).
- [ ] Terapkan UI Store — Hubungkan state pencarian dengan tombol di header dan event listener keyboard.
- [ ] Buat Mutasi Store — Setup state draf keranjang mutasi sementara untuk menampung beberapa komponen sebelum dikirim ke API.
- [ ] Terapkan Mutasi Store — Hubungkan tombol aksi di tabel barang dengan keranjang mutasi.
- [ ] Buat Preference Store — Setup state dengan fitur persist untuk menyimpan pengaturan tampilan (Tabel/Grid) dan filter ke `localStorage`.
- [ ] Terapkan Preference Store — Hubungkan state preferensi dengan UI halaman Inventaris agar pengaturan pengguna tidak hilang saat refresh.
- [ ] Sidebar State Store — Simpan status buka/tutup sidebar agar konsisten antar sesi.

## Development

- [ ] **Frontend Testing** — Vitest + React Testing Library + MSW (mock API).
  - [ ] Setup Vitest dan testing-library.
  - [ ] Test form Kategori (validasi, submit, error dari API).
  - [ ] Test interceptor Axios (token disisipkan, 401 ditangani).
- [ ] **Error Boundary** — Tangkap crash React, tampilkan layar ramah, kirim ke Sentry, dan tampilkan Request ID dari API call yang gagal.
- [ ] **Penanganan Error API** — Interceptor Axios menangani 401 (refresh token / logout) dan menampilkan `code` error dari backend.

## Security Scanning

[ ] Menggunakan Security Scanner untuk checking library apakah ada vulnerabillity atau tidak
https://trivy.dev/
