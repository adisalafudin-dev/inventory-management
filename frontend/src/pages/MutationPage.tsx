import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  Download,
  History,
  LoaderCircle,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutationHistory } from "@/features/mutation/hooks/mutationHook";
import { useExportCsv } from "@/features/item-tools/hooks/useAlatBahan";
import type { MutationTypeFilter } from "@/features/mutation/types";

export default function MutationPage() {
  const [page, setPage] = useState<number>(1);
  const [tipeFilter, setTipeFilter] = useState<MutationTypeFilter | "ALL">("ALL");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isLoading } = useMutationHistory({
    page,
    limit: 10,
    tipe: tipeFilter !== "ALL" ? tipeFilter : undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const { mutate: exportCsv, isPending: isExporting } = useExportCsv();

  const logs = data?.data ?? [];
  const meta = data?.meta;

  const handleResetFilter = () => {
    setTipeFilter("ALL");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const hasFilterActive =
    tipeFilter !== "ALL" || Boolean(startDate) || Boolean(endDate);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Header Halaman ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mutasi Stok
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pantau seluruh pergerakan barang masuk, barang keluar, dan riwayat
            penyesuaian stok alat & bahan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => exportCsv()}
            isDisabled={isExporting}
          >
            {isExporting ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="size-4" aria-hidden="true" />
            )}
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Tipe */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span>Tipe:</span>
            <select
              value={tipeFilter}
              onChange={(e) => {
                setTipeFilter(e.target.value as MutationTypeFilter | "ALL");
                setPage(1);
              }}
              className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter tipe mutasi"
            >
              <option value="ALL">Semua Mutasi</option>
              <option value="IN">Masuk (IN)</option>
              <option value="OUT">Keluar (OUT)</option>
            </select>
          </div>

          {/* Filter Rentang Tanggal */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span>Dari:</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="h-8 w-auto px-2 text-xs"
              aria-label="Tanggal mulai"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span>Sampai:</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="h-8 w-auto px-2 text-xs"
              aria-label="Tanggal selesai"
            />
          </div>

          {hasFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilter}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Reset Filter
            </Button>
          )}
        </div>

        {meta && (
          <p className="text-xs text-muted-foreground">
            Total:{" "}
            <span className="font-mono font-medium tabular-nums text-foreground">
              {meta.total}
            </span>{" "}
            aktivitas
          </p>
        )}
      </div>

      {/* ── Tabel Mutasi ── */}
      <div className="overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Tanggal & Waktu
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Nama Barang
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Tipe Mutasi
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Jumlah
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2 font-medium md:table-cell"
              >
                Keterangan
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <LoaderCircle className="size-5 animate-spin" />
                    <span>Memuat riwayat mutasi...</span>
                  </div>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2.5">
                    <span className="flex size-12 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
                      <History className="size-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-medium">
                      {hasFilterActive
                        ? "Tidak ada mutasi yang cocok dengan filter."
                        : "Belum ada riwayat mutasi stok."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {hasFilterActive
                        ? "Coba ubah tanggal atau tipe mutasi yang dipilih."
                        : "Setiap barang masuk dan keluar akan tercatat otomatis di sini."}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isMasuk = log.tipe === "IN";
                const isAudit = log.tipe === "AUDIT";

                return (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-muted/60"
                  >
                    {/* Tanggal & Waktu */}
                    <td className="h-11 whitespace-nowrap px-3 py-2 font-mono text-xs text-muted-foreground">
                      {formatDate(log.tanggal)}
                    </td>

                    {/* Nama Barang */}
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <Wrench className="size-3.5" aria-hidden="true" />
                        </span>
                        <span className="font-medium text-foreground">
                          {log.alatBahan?.namaBarang ?? "Barang tidak dikenal"}
                        </span>
                      </div>
                    </td>

                    {/* Tipe Mutasi Badge */}
                    <td className="px-3 py-2">
                      {isMasuk && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                          <ArrowDownToLine className="size-3" aria-hidden="true" />
                          Masuk
                        </span>
                      )}
                      {log.tipe === "OUT" && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                          <ArrowUpFromLine className="size-3" aria-hidden="true" />
                          Keluar
                        </span>
                      )}
                      {isAudit && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                          Audit
                        </span>
                      )}
                    </td>

                    {/* Jumlah */}
                    <td className="px-3 py-2 text-right">
                      <span
                        className={`font-mono text-sm font-semibold tabular-nums ${
                          isMasuk
                            ? "text-success"
                            : isAudit
                              ? "text-warning"
                              : "text-muted-foreground"
                        }`}
                      >
                        {isMasuk ? "+" : isAudit ? "" : "−"}
                        {Math.abs(log.jumlahPerubahan)}
                      </span>
                    </td>

                    {/* Keterangan */}
                    <td className="hidden max-w-xs truncate px-3 py-2 text-xs text-muted-foreground md:table-cell">
                      {log.keterangan || "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer Paginasi ── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Halaman{" "}
            <span className="font-mono tabular-nums">{meta.page}</span> dari{" "}
            <span className="font-mono tabular-nums">{meta.totalPages}</span> (
            <span className="font-mono tabular-nums">{meta.total}</span> total
            mutasi)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              isDisabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-4" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              isDisabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Selanjutnya
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}