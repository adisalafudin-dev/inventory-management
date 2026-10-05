import { useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  History,
  LoaderCircle,
  MapPin,
  Tag as TagIcon,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAlatBahan } from "../hooks/useAlatBahan";
import { useItemMutationHistory } from "@/features/mutation/hooks/mutationHook";
import type { MutationTypeFilter } from "@/features/mutation/types";

interface ItemHistoryDialogProps {
  itemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemHistoryDialog({
  itemId,
  open,
  onOpenChange,
}: ItemHistoryDialogProps) {
  const [page, setPage] = useState<number>(1);
  const [tipeFilter, setTipeFilter] = useState<MutationTypeFilter | "ALL">(
    "ALL",
  );

  // getOne: async (id: string): Promise<AlatBahan>
  const { data: item, isLoading: isLoadingItem } = useAlatBahan(itemId ?? "");

  console.log("item history dialog", item);

  // getItemHistory: async (itemId: string, params: MutationHistoryQueryParams): Promise<MutationHistoryResponse>
  const { data: historyData, isLoading: isLoadingHistory } =
    useItemMutationHistory(itemId ?? "", {
      page,
      limit: 5,
      tipe: tipeFilter !== "ALL" ? tipeFilter : undefined,
    });

  const logs = historyData?.data ?? [];

  const meta = historyData?.meta;

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
    <Dialog
      isOpen={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) {
          setPage(1);
          setTipeFilter("ALL");
        }
      }}
      className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <History className="size-5 text-primary" aria-hidden="true" />
          <span>Detail & Riwayat Mutasi</span>
        </DialogTitle>
        <DialogDescription>
          Informasi lengkap spesifikasi barang serta riwayat pergerakan stoknya.
        </DialogDescription>
      </DialogHeader>

      {isLoadingItem ? (
        <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />
          <span>Memuat detail barang...</span>
        </div>
      ) : item ? (
        <div className="space-y-5">
          {/* ── Ringkasan Barang ── */}
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary/15 text-secondary">
                    <Wrench className="size-4" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold leading-tight text-foreground">
                    {item.namaBarang}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
                  <span>
                    Kategori:{" "}
                    <strong className="font-medium text-foreground">
                      {item.kategori?.namaKategori}
                    </strong>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {item.lokasi?.namaLokasi ?? "—"}
                    {item.lokasi?.spesifikLetak
                      ? ` (${item.lokasi.namaLokasi} - ${item.lokasi.spesifikLetak})`
                      : ""}
                  </span>
                </div>

                {item.alatBahanTag && item.alatBahanTag.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1.5">
                    <TagIcon className="size-3 text-muted-foreground" />
                    {item.alatBahanTag.map((t) => (
                      <span
                        key={t.idTag}
                        className="font-mono text-[10px] text-muted-foreground"
                      >
                        #{t.tag.namaTag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Kondisi & Kuantitas */}
              <div className="flex shrink-0 items-center gap-2.5 sm:flex-col sm:items-end">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Stok:</span>
                  <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                    {item.kuantitas}
                  </span>
                </div>

                <div>
                  {item.kondisi === "BAIK" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                      <CircleCheck className="size-3" />
                      Kondisi Baik
                    </span>
                  )}
                  {item.kondisi === "KARATAN" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                      <TriangleAlert className="size-3" />
                      Karatan
                    </span>
                  )}
                  {item.kondisi === "RUSAK" && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-destructive/30 bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                      <CircleX className="size-3" />
                      Rusak
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Bagian Riwayat Mutasi Item ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-foreground">
                Riwayat Mutasi Barang
              </h4>

              <select
                value={tipeFilter}
                onChange={(e) => {
                  setTipeFilter(e.target.value as MutationTypeFilter | "ALL");
                  setPage(1);
                }}
                className="h-7 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                aria-label="Filter tipe mutasi barang"
              >
                <option value="ALL">Semua Mutasi</option>
                <option value="IN">Masuk (IN)</option>
                <option value="OUT">Keluar (OUT)</option>
              </select>
            </div>

            {/* Tabel Mutasi Spesifik Item */}
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/60 text-left text-muted-foreground">
                    <th scope="col" className="px-3 py-2 font-medium">
                      Tanggal & Waktu
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Tipe
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-2 text-right font-medium"
                    >
                      Perubahan
                    </th>
                    <th scope="col" className="px-3 py-2 font-medium">
                      Keterangan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoadingHistory ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-muted-foreground"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <LoaderCircle className="size-4 animate-spin" />
                          <span>Memuat log mutasi...</span>
                        </div>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Belum ada aktivitas mutasi untuk barang ini.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const isMasuk = log.tipe === "IN";
                      const isAudit = log.tipe === "AUDIT";

                      return (
                        <tr
                          key={log.id}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <td className="whitespace-nowrap px-3 py-2 font-mono text-muted-foreground">
                            {formatDate(log.tanggal)}
                          </td>
                          <td className="px-3 py-2">
                            {isMasuk && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/15 px-1.5 py-0.2 text-[10px] font-medium text-success">
                                <ArrowDownToLine className="size-2.5" />
                                Masuk
                              </span>
                            )}
                            {log.tipe === "OUT" && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-1.5 py-0.2 text-[10px] font-medium text-secondary-foreground">
                                <ArrowUpFromLine className="size-2.5" />
                                Keluar
                              </span>
                            )}
                            {isAudit && (
                              <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/15 px-1.5 py-0.2 text-[10px] font-medium text-warning">
                                Audit
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            <span
                              className={`font-mono font-semibold tabular-nums ${
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
                          <td className="max-w-xs truncate px-3 py-2 text-muted-foreground">
                            {log.keterangan || "—"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginasi Log Item */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-1">
                <p className="text-xs text-muted-foreground">
                  Halaman{" "}
                  <span className="font-mono tabular-nums">{meta.page}</span>{" "}
                  dari{" "}
                  <span className="font-mono tabular-nums">
                    {meta.totalPages}
                  </span>
                </p>
                <div className="flex gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    isDisabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="size-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    isDisabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="size-3" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Barang tidak ditemukan.
        </div>
      )}
    </Dialog>
  );
}
