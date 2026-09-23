# Backend Sistem Manajemen Inventaris Elektronik

### Fitur yang Sudah Tersedia

- [x] Autentikasi Aman — Login dan registrasi menggunakan JWT, dengan hashing password native melalui `Bun.password`.
- [x] Manajemen Master Data — CRUD lengkap untuk Kategori, Lokasi Penyimpanan, dan Sistem Label (Tags).
- [x] Manajemen Alat & Bahan — Pencatatan dan pelacakan stok komponen fisik.
- [x] Sistem Log Mutasi (Atomik) — Menggunakan _interactive transactions_ Prisma (`tx`) untuk menjamin konsistensi data saat stok masuk/keluar.
- [x] Dashboard Analytics — Endpoint statistik ringkasan (total barang, stok menipis, barang rusak, aktivitas terbaru), dioptimasi dengan `Promise.all()`.
- [x] Konsistensi Respons API — Global Interceptor dan Global Exception Filter untuk standarisasi format JSON di seluruh endpoint.
- [x] Export Data — Endpoint untuk mengunduh laporan stok dalam format CSV.

### Rekomendasi Peningkatan Sebelum Deploy

- [x] **Dokumentasi API Otomatis (Swagger/OpenAPI)** — Terpasang `@nestjs/swagger` dengan dekorator `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` di controller. Tersedia di `/api` (Swagger UI) dan `/reference` (Scalar API Reference).
- [ ] **Security Hardening (Helmet & Rate Limiting)** — Instal `helmet` untuk mengamankan HTTP header, dan `@nestjs/throttler` untuk membatasi endpoint `/auth/login` maksimal 5 permintaan per menit per IP.
- [x] **Validasi Environment Variables** — Validasi `.env` (`DATABASE_URL`, `JWT_SECRET`, dst) sudah diterapkan lewat `ConfigModule` + fungsi `validate` kustom; aplikasi menolak start dan menampilkan error log yang jelas bila variabel wajib tidak ditemukan.
- [x] **Application Logging** — Terintegrasi dengan `nestjs-pino`; Global Exception Filter mencatat error lengkap (termasuk stack trace untuk error 500) ke log terstruktur JSON.

# Integrasi Frontend Sistem Manajemen Inventaris Elektronik

### Setup Awal

- [x] Inisialisasi proyek React (Vite).
- [x] Setup shadcn/ui dan Tailwind CSS.
- [x] Buat API client menggunakan Axios dengan interceptor untuk menyisipkan token JWT secara otomatis ke header `Authorization` di setiap pemanggilan API.

### CRUD Frontend

- [x] Kategori — List (search + pagination), create, update, delete dengan validasi kepemilikan per user.
- [ ] Lokasi Penyimpanan — List, create, update, delete.
- [ ] Alat & Bahan — List, create, update, delete, plus form tambah/kurang stok.
- [ ] Tag — List, create, update, delete, dan relasi tag ke item inventori.
- [ ] Riwayat Mutasi — List dengan filter dan pagination.

### Roadmap State Management

- [ ] Buat UI Store — Setup state global untuk mengatur buka-tutup modal pencarian (`Ctrl+K`).
- [ ] Terapkan UI Store — Hubungkan state pencarian dengan tombol di header dan event listener keyboard.
- [ ] Buat Mutasi Store — Setup state draf keranjang mutasi sementara untuk menampung beberapa komponen sebelum dikirim ke API.
- [ ] Terapkan Mutasi Store — Hubungkan tombol aksi di tabel barang dengan keranjang mutasi.
- [ ] Buat Preference Store — Setup state dengan fitur persist untuk menyimpan pengaturan tampilan (Tabel/Grid) dan filter ke `localStorage`.
- [ ] Terapkan Preference Store — Hubungkan state preferensi dengan UI halaman Inventaris agar pengaturan pengguna tidak hilang saat refresh.
- [ ] Sidebar State Store — Simpan status buka/tutup sidebar agar konsisten antar sesi.
