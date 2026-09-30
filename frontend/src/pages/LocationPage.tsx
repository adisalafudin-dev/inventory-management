import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Location } from "@/features/location/types";
import {
  useCreateLocation,
  useDeleteLocation,
  useLocations,
  useUpdateLocation,
} from "@/features/location/hooks/useLocation";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  CreateLocationDialog,
  DeleteLocationDialog,
  UpdateLocationDialog,
} from "@/features/location/components/LocationDialog";
import type { LocationSchema } from "@/features/location/schema";

export default function LocationPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editTarget, setEditTarget] = useState<Location | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Location | null>(null);
  console.log(deleteTarget);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { mutate: createLocation, isPending: isCreating } = useCreateLocation();

  const { mutate: updateLocation, isPending: isUpdating } = useUpdateLocation();

  const { mutate: deleteLocation, isPending: isDeleting } = useDeleteLocation();

  const { data } = useLocations({
    search: debouncedSearch,
    page: page,
    limit: 10,
  });

  const handleCreate = (values: Parameters<typeof createLocation>[0]) => {
    createLocation(values, {
      onSuccess: () => setEditOpen(false),
    });
  };

  const handleOpenCreate = () => {
    setCreateOpen(!createOpen);
  };

  const handleOpenEdit = (loc: Location) => {
    setEditTarget(loc);
    setEditOpen(!editOpen);
  };

  const handleUpdate = (values: LocationSchema) => {
    if (!editTarget) return;
    updateLocation(
      { id: editTarget.id, payload: values },
      { onSuccess: () => setEditOpen(false) },
    );
  };

  const handleOpenDelete = (loc: Location) => {
    setDeleteOpen(true);
    setDeleteTarget(loc);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteLocation(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  // sekarang `data` beneran isinya response dari service (LocationListResponse)
  const locations = data?.data ?? []; // sesuaikan sama shape backend kamu
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      <CreateLocationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isPending={isCreating}
      ></CreateLocationDialog>
      <UpdateLocationDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        onSubmit={handleUpdate}
        isPending={isUpdating}
        defaultValues={
          editTarget
            ? {
                namaLokasi: editTarget.namaLokasi,
                spesifikLetak: editTarget.spesifikLetak ?? "",
              }
            : null
        }
      ></UpdateLocationDialog>

      <DeleteLocationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        target={deleteTarget}
        isPending={isDeleting}
        onConfirm={handleDeleteConfirm}
      ></DeleteLocationDialog>

      {/* ── Header Halaman ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Lokasi Penyimpanan
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catat rak, laci, atau kotak penyimpanan sampai level spesifik untuk
            mempermudah pencarian alat & bahan.
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
              placeholder="Cari lokasi penyimpanan..."
              className="w-full pl-9 sm:w-64"
              aria-label="Cari lokasi penyimpanan"
            />
          </div>

          {/* Tombol Tambah */}
          <Button onClick={handleOpenCreate}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah Lokasi
          </Button>
        </div>
      </div>

      {/* ── Tabel Lokasi ── */}
      <div className="overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Nama Lokasi
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2 font-medium md:table-cell"
              >
                Spesifik Letak
              </th>
              <th scope="col" className="w-24 px-3 py-2 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {locations?.map((lokasi) => (
              <tr
                key={lokasi.id}
                className="transition-colors hover:bg-muted/60"
              >
                <td className="h-11 px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <MapPin className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {lokasi.namaLokasi}
                      </p>
                      {/* Sub-label di layar mobile yang menyembunyikan kolom kedua */}
                      <p className="truncate text-xs text-muted-foreground md:hidden">
                        {lokasi.spesifikLetak || "—"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="hidden max-w-md px-3 py-2 md:table-cell">
                  <span className="line-clamp-1 text-muted-foreground">
                    {lokasi.spesifikLetak || "—"}
                  </span>
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(lokasi)}
                      type="button"
                      title={`Edit ${lokasi.namaLokasi}`}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(lokasi)}
                      title={`Hapus ${lokasi.namaLokasi}`}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── Empty State ── */}
        {locations.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
              {search ? (
                <Search className="size-5" aria-hidden="true" />
              ) : (
                <MapPin className="size-5" aria-hidden="true" />
              )}
            </span>
            {search ? (
              <>
                <p className="text-sm font-medium">
                  Tidak ada lokasi yang cocok dengan “{search}”.
                </p>
                <p className="text-sm text-muted-foreground">
                  Coba kata kunci lain, atau kosongkan kolom pencarian.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">
                  Belum ada lokasi penyimpanan.
                </p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Tambah lokasi pertama untuk mulai mengatur penempatan alat &
                  bahan — misalnya “Rak A / Laci 04” atau “Meja Solder”.
                </p>
                <Button
                  variant="outline"
                  className="mt-1"
                  onClick={handleOpenCreate}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Tambah Lokasi
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {meta ? (
        <>
          {/* ── Footer Tabel / Paginasi ── */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-muted-foreground">
              Menampilkan{" "}
              <span className="font-mono tabular-nums">{locations.length}</span>{" "}
              lokasi penyimpanan
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
                isDisabled={page >= (meta?.totalPages ?? 1)}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
