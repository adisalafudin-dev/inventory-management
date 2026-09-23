import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  Package,
  ShieldAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardSummary } from "@/features/dashboard/hooks/useDashboardSummary";
// @ts-expect-error JavaScript component has no declaration file yet.
import DashboardNavbar from "../features/dashboard/components/DashboardNavbar";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useDashboardSummary(); // ✅ ambil isLoading & isError

  // ✅ WAJIB dicek dulu sebelum akses data.data.apapun
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DashboardNavbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <p className="text-sm text-muted-foreground">Memuat dashboard...</p>
        </main>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <DashboardNavbar />
        <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <p className="text-sm text-destructive">
            Gagal memuat data dashboard.
          </p>
        </main>
      </div>
    );
  }

  // ✅ ambil sesuai struktur asli dari screenshot
  const { statistik, peringatan, aktivitasTerbaru } = data.data;

  const stats = [
    {
      label: "Total Jenis Barang",
      value: statistik.totalJenisBarang ?? 0, // ✅ nama field yang benar
      icon: Package,
      color: "text-primary" as const,
      bgColor: "bg-primary/10" as const,
    },
    {
      label: "Barang Rusak",
      value: statistik.totalBarangRusak ?? 0, // ✅ sekarang ambil dari data asli, bukan hardcode 0
      icon: ShieldAlert,
      color: "text-destructive" as const,
      bgColor: "bg-destructive/10" as const,
    },
  ];

  const stokMenipis = peringatan.stokMenipis ?? [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Header / Navbar ── */}
      <DashboardNavbar></DashboardNavbar>
      {/* ── Content ── */}
      <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Selamat datang kembali, {user?.username ?? "User"}. Berikut
            ringkasan inventori Anda.
          </p>
        </div>

        {/* ── Stat Cards ── */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-5"
              >
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg",
                    stat.bgColor,
                  )}
                >
                  <Icon
                    className={cn("size-5", stat.color)}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="mt-0.5 text-2xl font-semibold tabular-nums">
                    {stat.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Two-column layout: Stok Menipis + Aktivitas Terbaru ── */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Peringatan Stok Menipis */}
          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <AlertTriangle
                className="size-5 text-warning"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-sm font-semibold">Stok Menipis</h2>
                <p className="text-xs text-muted-foreground">
                  Barang dengan kuantitas kurang dari 5
                </p>
              </div>
            </div>

            {stokMenipis.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
                <Package
                  className="size-8 text-muted-foreground/40"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  Belum ada data stok menipis.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {stokMenipis.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {item.namaBarang}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Kondisi: {item.kondisi}
                      </p>
                    </div>
                    <span className="ml-4 shrink-0 font-mono text-sm font-semibold tabular-nums text-warning">
                      {item.kuantitas}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Aktivitas Terbaru */}
          <section className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <ClipboardList
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-sm font-semibold">Aktivitas Terbaru</h2>
                <p className="text-xs text-muted-foreground">
                  5 mutasi stok terakhir
                </p>
              </div>
            </div>

            {aktivitasTerbaru.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-5 py-12 text-center">
                <ClipboardList
                  className="size-8 text-muted-foreground/40"
                  aria-hidden="true"
                />
                <p className="text-sm text-muted-foreground">
                  Belum ada aktivitas mutasi.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {aktivitasTerbaru.map((log: any) => {
                  const isMasuk = log.tipe === "IN";
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 px-5 py-3"
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
                          {log.alatBahan.namaBarang}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {log.keterangan ?? "—"} ·{" "}
                          {new Date(log.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 font-mono text-sm font-semibold tabular-nums",
                          isMasuk ? "text-success" : "text-muted-foreground",
                        )}
                      >
                        {isMasuk ? "+" : "−"}
                        {log.jumlahPerubahan}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
