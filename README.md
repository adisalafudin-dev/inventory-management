# Inventory Manager

Aplikasi manajemen inventori untuk mencatat alat, bahan, stok, lokasi penyimpanan, kategori, tag, dan riwayat mutasi.

Project ini terdiri dari backend NestJS dan frontend React yang dikelola sebagai dua aplikasi terpisah.

## Fitur

- Registrasi dan login menggunakan JWT.
- CRUD kategori.
- CRUD lokasi penyimpanan.
- CRUD alat dan bahan.
- Penambahan dan pengurangan stok.
- Riwayat mutasi stok dengan filter dan pagination.
- Pengelolaan tag dan relasi tag dengan item inventori.
- Ringkasan dashboard inventori.
- Export laporan inventori ke CSV.
- Dokumentasi API dengan Swagger UI dan Scalar API Reference.
- Validasi request dan format response terstandar.

## Tech Stack

### Backend

- Bun
- NestJS 12
- TypeScript
- Prisma 8 / Prisma Next
- PostgreSQL
- JWT dan Passport
- class-validator
- Swagger/OpenAPI
- Scalar API Reference
- Vitest
- Oxlint

### Frontend

- Bun
- Vite
- React 19
- TypeScript
- Tailwind CSS v4
- React Router v7
- TanStack Query
- Zustand
- Axios
- React Hook Form
- Zod
- shadcn/ui

## Prerequisites

- Bun 1.3 atau versi yang kompatibel dengan project.
- PostgreSQL, atau Docker dan Docker Compose.
- Git.

## Project Structure

```text
inventory-manager/
├── backend/
│   ├── prisma.config.ts
│   ├── prisma/schema.prisma
│   ├── migrations/
│   └── src/
│       ├── auth/
│       ├── user/
│       ├── category/
│       ├── location/
│       ├── alat-bahan/
│       ├── tag/
│       ├── dashboard/
│       ├── common/
│       ├── config/
│       └── prisma/
├── frontend/
│   └── src/
│       ├── components/
│       ├── features/
│       ├── hooks/
│       ├── pages/
│       ├── routes/
│       ├── store/
│       └── utils/
├── AGENTS.md
└── README.md
```

## Quick Start

### 1. Clone repository

```bash
git clone <repository-url>
cd inventory-manager
```

### 2. Install dependencies

Backend dan frontend memiliki `package.json` masing-masing.

```bash
cd backend
bun install

cd ../frontend
bun install
cd ..
```

### 3. Configure backend environment

Buat file `backend/.env` berdasarkan `backend/.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_db?schema=public"
JWT_SECRET="replace-with-a-secure-secret"
# Optional Nest Observe telemetry credentials
OBSERVE_APP_KEY="your_observe_app_key"
OBSERVE_APP_SECRET="your_observe_app_secret"
```

`OBSERVE_APP_KEY` dan `OBSERVE_APP_SECRET` bersifat opsional. Isi keduanya hanya jika telemetry Nest Observe digunakan; gunakan kredensial valid dari Nest Observe.

Jangan commit file `.env` atau secret ke repository.

### 4. Start PostgreSQL

Untuk development, gunakan Docker Compose dari folder `backend`:

```bash
cd backend
docker compose up -d
```

Jika PostgreSQL sudah berjalan secara lokal, pastikan `DATABASE_URL` menunjuk ke database yang benar.

### 5. Prepare database

Jalankan dari `backend`:

```bash
bunx prisma db migrate
bunx prisma contract emit
```

### 6. Start backend

```bash
bun run start:dev
```

Backend berjalan pada `http://localhost:3000` secara default.

### 7. Start frontend

Buka terminal baru:

```bash
cd frontend
bun run dev
```

Vite akan menampilkan URL frontend pada terminal, biasanya `http://localhost:5173`.

## Backend Commands

Jalankan dari `backend/`:

| Command                      | Description                                 |
| ---------------------------- | ------------------------------------------- |
| `bun run start:dev`          | Menjalankan backend dalam watch mode        |
| `bun run build`              | Build backend                               |
| `bun run start:prod`         | Menjalankan build production                |
| `bun run lint`               | Menjalankan Oxlint                          |
| `bun test`                   | Menjalankan unit test                       |
| `bun run test:e2e`           | Menjalankan end-to-end test                 |
| `bun run format`             | Memformat source TypeScript dengan Prettier |
| `bunx prisma db migrate`     | Menjalankan migrasi database                |
| `bunx prisma migration plan` | Melihat rencana migrasi                     |
| `bunx prisma contract emit`  | Menghasilkan contract Prisma                |

Dari root, command backend juga dapat dijalankan dengan `bun run --cwd backend <script>`.

## Frontend Commands

Jalankan dari `frontend/`:

| Command           | Description                         |
| ----------------- | ----------------------------------- |
| `bun run dev`     | Menjalankan Vite development server |
| `bun run build`   | Type-check dan build frontend       |
| `bun run lint`    | Menjalankan ESLint                  |
| `bun run preview` | Preview hasil build                 |

## API Documentation

Setelah backend berjalan, dokumentasi API tersedia di:

- Swagger UI: [http://localhost:3000/api](http://localhost:3000/api)
- Scalar API Reference: [http://localhost:3000/reference](http://localhost:3000/reference)
- OpenAPI JSON: [http://localhost:3000/api-json](http://localhost:3000/api-json)

Sebagian besar endpoint membutuhkan JWT. Gunakan tombol **Authorize** di Swagger dan masukkan:

```text
Bearer <access-token>
```

Endpoint publik:

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`

## API Routes

| Controller     | Base route           | Description                                         |
| -------------- | -------------------- | --------------------------------------------------- |
| Health         | `/health`            | Health check                                        |
| Authentication | `/auth`              | Register dan login                                  |
| Users          | `/user`              | User lookup dan administrasi                        |
| Categories     | `/category`          | Category CRUD                                       |
| Locations      | `/location`          | Location CRUD                                       |
| Inventory      | `/alat-bahan`        | Inventory CRUD, stock, mutation log, dan CSV export |
| Tags           | `/tag`               | Tag CRUD dan relasi item-tag                        |
| Dashboard      | `/dashboard/summary` | Ringkasan inventori pengguna                        |

Response sukses menggunakan format berikut:

```json
{
  "statusCode": 200,
  "message": "Permintaan berhasil diproses",
  "data": {}
}
```

## Database

Model utama dalam database:

- `User`
- `Kategori`
- `LokasiPenyimpanan`
- `AlatBahan`
- `LogMutasi`
- `Tag`
- `ItemTag`

Sumber contract database berada di `backend/prisma/schema.prisma`. Generated Prisma output berada di `backend/src/generated/prisma/`; jangan mengedit output generated secara langsung.

## Contributing

1. Buat branch dari `main`.

   ```bash
   git checkout -b feat/nama-perubahan
   ```

2. Ikuti konvensi yang dijelaskan di [AGENTS.md](AGENTS.md).
3. Perbarui DTO, controller, test, dan dokumentasi bila contract API berubah.
4. Jalankan validasi yang relevan sebelum commit:

   ```bash
   bun run --cwd backend build
   bun run --cwd backend lint
   bun --cwd frontend run build
   bun --cwd frontend run lint
   ```

5. Gunakan format commit berikut:

   ```text
   <type>: <deskripsi singkat>
   ```

   Type yang umum digunakan: `feat`, `fix`, `docs`, `refactor`, `test`, dan `chore`.

6. Buka Pull Request dengan ringkasan perubahan, cara validasi, dan catatan migrasi bila ada.

## Security Notes

- Gunakan `JWT_SECRET` yang kuat dan berbeda untuk setiap environment.
- Jangan mencetak `DATABASE_URL`, `JWT_SECRET`, access token, atau credential lainnya ke log.
- Jangan commit `.env`.
- Validasi endpoint yang membutuhkan autentikasi melalui JWT sebelum digunakan di production.

## License

Project ini belum menetapkan lisensi publik. Jangan mendistribusikan ulang tanpa persetujuan pemilik repository.
