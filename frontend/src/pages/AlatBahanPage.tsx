import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Download,
  LoaderCircle,
  MapPin,
  Minus,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  useAlatBahanList,
  useCreateAlatBahan,
  useUpdateAlatBahan,
  useDeleteAlatBahan,
  useExportCsv,
  useIncreaseStock,
  useDecreaseStock,
} from "@/features/item-tools/hooks/useAlatBahan";
import {
  CreateAlatBahanDialog,
  DeleteAlatBahanDialog,
  UpdateAlatBahanDialog,
  StokDialog,
  ItemHistoryDialog,
} from "@/features/item-tools/components/DialogAlatBahan";
import type { AlatBahan, Kondisi } from "@/features/item-tools/types";
import type { AlatBahanSchema, StokSchema } from "@/features/item-tools/schema";

export default function AlatBahanPage() {
  const [search, setSearch] = useState("");
  const [kondisiFilter, setKondisiFilter] = useState<Kondisi | "ALL">("ALL");
  const [page, setPage] = useState(1);

  // Dialog State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isIncreaseStockOpen, setIsIncreaseStockOpen] = useState(false);
  const [isDecreaseStockOpen, setIsDecreaseStockOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [editTarget, setEditTarget] = useState<AlatBahan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AlatBahan | null>(null);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data } = useAlatBahanList({
    search: debouncedSearch || undefined,
    kondisi: kondisiFilter !== "ALL" ? kondisiFilter : undefined,
    page,
    limit: 10,
  });

  const { mutate: createItem, isPending: isCreating } = useCreateAlatBahan();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateAlatBahan();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteAlatBahan();
  const { mutate: exportCsv, isPending: isExporting } = useExportCsv();
  const { mutate: increaseStock, isPending: isIncreasingStock } =
    useIncreaseStock();
  const { mutate: decreaseStock, isPending: isDecreasingStock } =
    useDecreaseStock();

  const items = data?.data ?? [];
  console.log("AlatBahanPage items:", items);
  const meta = data?.meta;

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleOpenInCreaseStock = (item: AlatBahan) => {
    setEditTarget(item);
    setIsIncreaseStockOpen(true);
  };

  const handleOpenDecreaseStock = (item: AlatBahan) => {
    setEditTarget(item);
    setIsDecreaseStockOpen(true);
  };

  const handleOpenEdit = (item: AlatBahan) => {
    setEditTarget(item);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (values: AlatBahanSchema) => {
    createItem(
      {
        namaBarang: values.namaBarang,
        kuantitas: values.kuantitas,
        kondisi: values.kondisi,
        idKategori: Number(values.idKategori),
        idLokasi: Number(values.idLokasi),
        tagIds: values.tagIds || [],
      },
      {
        onSuccess: () => setIsCreateOpen(false),
      },
    );
  };

  const handleIncreaseStockSubmit = (values: StokSchema) => {
    if (!editTarget) return;
    increaseStock(
      {
        id: editTarget.id,
        payload: {
          jumlah: values.jumlah,
          keterangan: values.keterangan,
        },
      },
      {
        onSuccess: () => {
          setIsIncreaseStockOpen(false);
          setEditTarget(null);
        },
      },
    );
  };

  const handleDecreaseStockSubmit = (values: StokSchema) => {
    if (!editTarget) return;
    decreaseStock(
      {
        id: editTarget.id,
        payload: {
          jumlah: values.jumlah,
          keterangan: values.keterangan,
        },
      },
      {
        onSuccess: () => {
          setIsDecreaseStockOpen(false);
          setEditTarget(null);
        },
      },
    );
  };

  const handleEditSubmit = (values: AlatBahanSchema) => {
    if (!editTarget) return;
    updateItem(
      {
        id: editTarget.id,
        payload: {
          namaBarang: values.namaBarang,
          kuantitas: values.kuantitas,
          kondisi: values.kondisi,
          idKategori: values.idKategori,
          idLokasi: values.idLokasi,
          tagIds: values.tagIds || [],
        },
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditTarget(null);
        },
      },
    );
  };

  const handleDeleteConfirm = (item: AlatBahan) => {
    deleteItem(item.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const handleOpenHistory = (item: AlatBahan) => {
    setEditTarget(item);
    setIsHistoryOpen(true);
  };

  const isEmpty = items.length === 0;

  return (
    <div className="space-y-4 pb-16">
      {/* ── Header Halaman ── */}
      <div className="flex  flex-col w-full md:flex-row  gap-3 justify-center md:justify-between">
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-2xl font-semibold tracking-tight">
            Alat & Bahan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Daftar seluruh perkakas, komponen, dan bahan kerja beserta jumlah
            stok, kondisi, dan lokasi penyimpanannya.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Pencarian */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari alat atau bahan..."
              className="w-full pl-9 sm:w-60"
              aria-label="Cari alat atau bahan"
            />
          </div>

          {/* Filter Kondisi */}
          <select
            value={kondisiFilter}
            onChange={(e) => {
              setKondisiFilter(e.target.value as Kondisi | "ALL");
              setPage(1);
            }}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Filter kondisi barang"
          >
            <option value="ALL">Semua Kondisi</option>
            <option value="BAIK">Kondisi Baik</option>
            <option value="KARATAN">Kondisi Karatan</option>
            <option value="RUSAK">Kondisi Rusak</option>
          </select>

          {/* Tombol Tambah */}
          <Button onClick={handleOpenCreate}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah Alat / Bahan
          </Button>
        </div>
      </div>

      {/* ── Dialog Modals ── */}
      <CreateAlatBahanDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isPending={isCreating}
        onSubmit={handleCreateSubmit}
      />

      <UpdateAlatBahanDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        isPending={isUpdating}
        onSubmit={handleEditSubmit}
        defaultValues={
          editTarget
            ? {
                namaBarang: editTarget.namaBarang,
                kuantitas: editTarget.kuantitas,
                kondisi: editTarget.kondisi,
                idKategori: editTarget.idKategori,
                idLokasi: editTarget.idLokasi,
                tagIds: editTarget.alatBahanTag?.map((at) => at.tag.id) ?? [],
              }
            : null
        }
      />
      <StokDialog
        open={isIncreaseStockOpen}
        onOpenChange={setIsIncreaseStockOpen}
        target={editTarget}
        mode="increase"
        isPending={isIncreasingStock}
        onSubmit={handleIncreaseStockSubmit}
      />

      <StokDialog
        open={isDecreaseStockOpen}
        onOpenChange={setIsDecreaseStockOpen}
        target={editTarget}
        mode="decrease"
        isPending={isDecreasingStock}
        onSubmit={handleDecreaseStockSubmit}
      />

      <ItemHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
        itemId={editTarget?.id}
      />

      <DeleteAlatBahanDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        target={deleteTarget}
        isPending={isDeleting}
        onConfirm={handleDeleteConfirm}
      />

      {/* ── Tabel Alat & Bahan ── */}
      <div className="overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Nama Barang & Tag
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2 font-medium md:table-cell"
              >
                Kategori
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2 font-medium lg:table-cell"
              >
                Lokasi Penyimpanan
              </th>
              <th scope="col" className="px-3 py-2 font-medium">
                Kondisi
              </th>
              <th scope="col" className="px-3 py-2 text-right font-medium">
                Kuantitas
              </th>
              <th scope="col" className="w-20 px-3 py-2 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((item) => {
              const isLowStock = item.kuantitas < 5;

              return (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-muted/60"
                >
                  {/* Nama Barang & Tags */}
                  <td
                    className="h-11 px-3 py-2"
                    onClick={() => handleOpenHistory(item)}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Wrench className="size-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {item.namaBarang}
                        </p>
                        {/* Mobile preview ringkas */}
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:hidden">
                          <span>
                            {item.kategori?.namaKategori ?? "Tanpa Kategori"}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {item.lokasi?.namaLokasi ?? "Tanpa Lokasi"}
                          </span>
                        </div>
                        {/* Tags list */}
                        {item.alatBahanTag && item.alatBahanTag.length > 0 && (
                          <div className="mt-0.5 hidden flex-wrap gap-1 sm:flex">
                            {item.alatBahanTag.map((t) => (
                              <span
                                key={t.tag.id}
                                className="font-mono text-[10px] text-muted-foreground"
                              >
                                #{t.tag.namaTag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="hidden px-3 py-2 md:table-cell">
                    <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
                      {item.kategori?.namaKategori ?? "—"}
                    </span>
                  </td>

                  {/* Lokasi */}
                  <td className="hidden max-w-xs px-3 py-2 lg:table-cell">
                    <div className="flex items-start gap-1.5 text-xs">
                      <MapPin
                        className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {item.lokasi?.namaLokasi ?? "—"}
                        </p>
                        {item.lokasi?.spesifikLetak ? (
                          <p className="truncate text-muted-foreground">
                            {item.lokasi.spesifikLetak}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  {/* Kondisi */}
                  <td className="px-3 py-2">
                    {item.kondisi === "BAIK" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                        <CircleCheck className="size-3" aria-hidden="true" />
                        Baik
                      </span>
                    )}
                    {item.kondisi === "KARATAN" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
                        <TriangleAlert className="size-3" aria-hidden="true" />
                        Karatan
                      </span>
                    )}
                    {item.kondisi === "RUSAK" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
                        <CircleX className="size-3" aria-hidden="true" />
                        Rusak
                      </span>
                    )}
                  </td>

                  {/* Kuantitas Stok */}
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <span
                        className={`font-mono text-sm font-semibold tabular-nums ${
                          isLowStock ? "text-warning" : "text-foreground"
                        }`}
                      >
                        {item.kuantitas}
                      </span>
                      {isLowStock && (
                        <span className="inline-flex rounded-sm bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                          Menipis
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Aksi */}
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        type="button"
                        title={`Edit ${item.namaBarang}`}
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
                        title={`Hapus ${item.namaBarang}`}
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenInCreaseStock(item)}
                        title="Tambah Alat / Bahan"
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <Plus className="size-4" aria-hidden="true" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDecreaseStock(item)}
                        title="Kurangi Stok"
                        className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        <Minus className="size-4" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ── Empty State ── */}
        {isEmpty && (
          <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
              {search || kondisiFilter !== "ALL" ? (
                <Search className="size-5" aria-hidden="true" />
              ) : (
                <Wrench className="size-5" aria-hidden="true" />
              )}
            </span>
            {search || kondisiFilter !== "ALL" ? (
              <>
                <p className="text-sm font-medium">
                  Tidak ada alat atau bahan yang cocok dengan pencarian.
                </p>
                <p className="text-sm text-muted-foreground">
                  Coba kata kunci lain atau ubah filter status kondisi.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">
                  Belum ada alat atau bahan.
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Catat alat, komponen, atau bahan kerja pertama Anda untuk
                  mulai mengelola stok dan letak penyimpanannya.
                </p>
                <Button
                  variant="outline"
                  className="mt-1"
                  onClick={handleOpenCreate}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Tambah Alat / Bahan
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Footer Tabel / Paginasi ── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Halaman <span className="font-mono tabular-nums">{meta.page}</span>{" "}
            dari{" "}
            <span className="font-mono tabular-nums">{meta.totalPages}</span> (
            <span className="font-mono tabular-nums">{meta.total}</span> total
            barang)
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

      <Button
        type="button"
        variant="outline"
        isDisabled={isExporting}
        onClick={() => exportCsv()}
        className="fixed bottom-5 right-5 z-40 gap-2 border-border bg-background shadow-lg"
        aria-label={
          isExporting ? "Menyiapkan ekspor CSV" : "Ekspor inventaris ke CSV"
        }
      >
        {isExporting ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Download className="size-4" aria-hidden="true" />
        )}
        {isExporting ? "Menyiapkan..." : "Export CSV"}
      </Button>
    </div>
  );
}
