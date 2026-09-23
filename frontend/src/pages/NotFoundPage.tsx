import { ArrowRight, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/store/useAuthStore";

export default function NotFoundPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <main className="grid min-h-svh place-items-center bg-background p-4 text-foreground md:p-6">
      <section className="w-full max-w-md">
        <Link
          to={ROUTES.HOME}
          className="mb-6 inline-flex items-center gap-2 rounded-md px-1 py-1 text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Kembali ke beranda Inventory Manager"
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Box className="size-4" aria-hidden="true" />
          </span>
          Inventory Manager
        </Link>

        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <div className="border-b border-border bg-muted px-6 py-3">
            <span className="font-mono text-sm font-semibold tracking-wide text-muted-foreground">
              STATUS 404
            </span>
          </div>

          <div className="space-y-5 p-6 md:p-8">
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary">
                Halaman tidak ditemukan
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Lokasi yang Anda tuju tidak tersedia.
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Tautan ini mungkin sudah berubah, atau alamatnya tidak lengkap.
                Kembali ke beranda untuk melanjutkan pekerjaan inventori Anda.
              </p>
            </div>

            <div className="rounded-md border border-border bg-background p-4 text-sm text-muted-foreground">
              Gunakan menu untuk membuka Dashboard, Alat &amp; Bahan, atau
              catatan Mutasi Stok.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to={ROUTES.HOME}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground outline-none transition-colors hover:bg-primary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Kembali ke beranda
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Masuk ke akun
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
