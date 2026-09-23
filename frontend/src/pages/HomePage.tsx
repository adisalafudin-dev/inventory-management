import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  Box,
  CircleX,
  FileDown,
  FolderTree,
  MapPin,
  Package,
  PackagePlus,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const painPoints = [
  "Stok di buku catatan beda dengan stok yang ada di rak.",
  "Alat dipinjam orang, lalu hilang jejak siapa yang terakhir mengambil.",
  "Satu barang dicari berkeliling gudang padahal tersimpan rapi di tempatnya.",
];

const mutations = [
  {
    date: "19/09",
    name: "Sensor suhu DS18B20",
    type: "masuk" as const,
    amount: 24,
    note: "Pengadaan Q3",
    location: "Rak A / Laci 04",
  },
  {
    date: "18/09",
    name: "Multimeter digital",
    type: "keluar" as const,
    amount: 1,
    note: "Dipinjam teknisi lapangan",
    location: "Meja teknisi",
  },
  {
    date: "18/09",
    name: "Kabel jumper male-female",
    type: "keluar" as const,
    amount: 6,
    note: "Proyek kandang pintar",
    location: "Rak B / Kotak 12",
  },
  {
    date: "17/09",
    name: "Baut M6 × 20 mm",
    type: "masuk" as const,
    amount: 500,
    note: "Restok rak kerja",
    location: "Rak C / Toples 03",
  },
];

const modules = [
  {
    icon: Package,
    name: "Alat & Bahan",
    description:
      "Daftar barang dengan jumlah, kondisi (baik / rusak / hilang), dan foto lokasinya di rak.",
  },
  {
    icon: FolderTree,
    name: "Kategori",
    description:
      "Kelompokkan barang sesuai cara kerja Anda — elektronik, perkakas, habis pakai, apa pun.",
  },
  {
    icon: MapPin,
    name: "Lokasi Penyimpanan",
    description:
      "Catat rak, laci, atau kotak penyimpanan sampai level spesifik seperti “Rak B / Kotak 12”.",
  },
  {
    icon: PackagePlus,
    name: "Mutasi Stok",
    description:
      "Setiap barang masuk dan keluar tercatat beserta jumlah, tanggal, dan keterangannya.",
  },
  {
    icon: Tags,
    name: "Tag",
    description:
      "Lampirkan beberapa label pada satu barang supaya pencarian tidak bergantung pada satu nama.",
  },
  {
    icon: FileDown,
    name: "Export CSV",
    description:
      "Seluruh data inventori bisa diunduh kapan saja — milik Anda, bukan terkunci di aplikasi.",
  },
];

const steps = [
  {
    title: "Daftar & siapkan struktur",
    description:
      "Buat kategori dan lokasi penyimpanan sesuai tata letak gudang atau ruang kerja Anda.",
  },
  {
    title: "Catat alat & bahan beserta letaknya",
    description:
      "Masukkan barang satu per satu, tentukan kategori, lokasi rak, dan kondisinya saat ini.",
  },
  {
    title: "Catat setiap barang masuk & keluar",
    description:
      "Satu klik per pergerakan stok. Jumlah selalu mutakhir dan riwayatnya bisa ditelusuri ulang.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2.5"
            aria-label="Inventory Manager — beranda"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Box className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold tracking-tight">
              Inventory Manager
            </span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Navigasi utama">
            <a
              href="#modul"
              className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-block"
            >
              Modul
            </a>
            <a
              href="#cara-kerja"
              className="hidden rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:inline-block"
            >
              Cara kerja
            </a>
            <Link
              to={ROUTES.LOGIN}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Masuk
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Daftar
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        {/* garis buku besar — kertas catatan gudang */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(to_bottom,transparent,transparent_35px,var(--border)_35px,var(--border)_36px)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-14 md:grid-cols-2 md:items-center md:px-8 md:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground">
              Untuk gudang, bengkel, lab, dan UMKM
            </p>
            <h1 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
              Berhenti menebak-nebak stok yang ada di rak.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
              Inventory Manager mencatat alat, bahan, lokasi penyimpanannya, dan
              setiap barang masuk–keluar — supaya jumlah di catatan selalu sama
              dengan jumlah di gudang.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to={ROUTES.REGISTER}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Daftar & catat item pertama
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="rounded-md border border-border bg-card px-5 py-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              Butuh akun untuk memulai — pendaftaran hanya butuh email,
              username, dan password.
            </p>
          </div>

          {/* Momen visual: lembar mutasi stok asli */}
          <div className="relative">
            <div className="border border-border bg-card shadow-xl shadow-black/10">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    LOG MUTASI
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">
                    Pergerakan barang terakhir
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  <span
                    className="size-1.5 rounded-full bg-success"
                    aria-hidden="true"
                  />
                  Stok tercatat
                </span>
              </div>
              <div className="divide-y divide-border">
                {mutations.map((row) => {
                  const isMasuk = row.type === "masuk";
                  return (
                    <div
                      key={`${row.date}-${row.name}`}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-md",
                          isMasuk
                            ? "bg-success/15 text-success"
                            : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isMasuk ? (
                          <ArrowDownToLine
                            className="size-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <ArrowUpFromLine
                            className="size-4"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {row.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          <span className="font-mono">{row.date}</span> ·{" "}
                          {row.note} · {row.location}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "font-mono text-sm font-semibold tabular-nums",
                          isMasuk ? "text-success" : "text-muted-foreground",
                        )}
                      >
                        {isMasuk ? "+" : "−"}
                        {row.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-border bg-muted px-4 py-2.5 text-xs text-muted-foreground">
                <span className="font-mono">4 aktivitas · 19 Sep 2026</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <FileDown className="size-3.5" aria-hidden="true" />
                  Bisa di-export ke CSV
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Masalah */}
      <section className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
        <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-start">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Pencatatan manual selalu ketinggalan satu langkah.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Buku catatan dan spreadsheet bisa dipakai, tapi hanya kalau selalu
              diperbarui tepat waktu. Saat pekerjaan menumpuk, catatan
              tertinggal — dan stok berubah jadi tebakan.
            </p>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {painPoints.map((point) => (
              <li key={point} className="flex items-start gap-3 py-4">
                <CircleX
                  className="mt-0.5 size-4 shrink-0 text-destructive"
                  aria-hidden="true"
                />
                <span className="text-sm leading-6">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Modul */}
      <section id="modul" className="border-y border-border bg-muted/50">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Semua yang perlu dicatat, satu tempat.
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Enam modul yang saling terhubung — bukan fitur tempelan. Data yang
              Anda masukkan di satu tempat langsung berguna di tempat lain.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div key={mod.name} className="bg-card p-6">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 text-base font-semibold">{mod.name}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {mod.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cara kerja — urutan nyata, bukan dekorasi angka */}
      <section
        id="cara-kerja"
        className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20"
      >
        <h2 className="max-w-2xl text-2xl font-semibold tracking-tight md:text-3xl">
          Mulai dipakai dalam tiga langkah.
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative border-t-2 border-border pt-5"
            >
              <span
                className="absolute -top-px left-0 h-0.5 w-12 bg-primary"
                aria-hidden="true"
              />
              <p className="font-mono text-xs font-semibold text-muted-foreground">
                LANGKAH {index + 1}
              </p>
              <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex items-center gap-2 rounded-md bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90"
          >
            Mulai dari langkah pertama
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* CTA penutup */}
      <section className="border-t border-border bg-secondary text-secondary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 md:flex-row md:items-center md:justify-between md:px-8 md:py-16">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
              Gudang yang rapi dimulai dari catatan yang rapi.
            </h2>
            <p className="mt-3 text-sm leading-6 text-secondary-foreground/75">
              Daftarkan akun, catat barang pertama Anda hari ini, dan mulailah
              menelusuri stok tanpa harus berkeliling mencarinya.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Buat akun gratis
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="rounded-md border border-secondary-foreground/30 px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary-foreground/10"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p className="flex items-center gap-2">
            <Box className="size-3.5" aria-hidden="true" />
            Inventory Manager — catatan kerja untuk barang yang nyata.
          </p>
          <p className="font-mono">
            KATEGORI · LOKASI · ALAT BAHAN · MUTASI · TAG
          </p>
        </div>
      </footer>
    </main>
  );
}
