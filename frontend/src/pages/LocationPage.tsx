import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/* ------------------------------------------------------------------ */
/*  Placeholder data layout — ganti dengan hook API (mis. useLocations)*/
/*  saat integrasi data backend sudah siap.                           */
/* ------------------------------------------------------------------ */

export interface LocationItem {
  id: number;
  namaLokasi: string;
  spesifikLetak: string | null;
}

const INITIAL_MOCK_LOCATIONS: LocationItem[] = [
  {
    id: 1,
    namaLokasi: "Rak Komponen 25 Laci",
    spesifikLetak: "Laci No. 12 (Komponen Pasif)",
  },
  {
    id: 2,
    namaLokasi: "Meja Solder & Kerja",
    spesifikLetak: "Kotak Perkakas Tengah",
  },
  {
    id: 3,
    namaLokasi: "Lemari Besi A",
    spesifikLetak: "Tingkat 2 / Sisi Kiri",
  },
  {
    id: 4,
    namaLokasi: "Rak Bahan Habis Pakai",
    spesifikLetak: "Toples Baut M6 & Sekrup",
  },
  {
    id: 5,
    namaLokasi: "Gudang Belakang - Rak D",
    spesifikLetak: "Kardus Modul Sensor IoT",
  },
];

export default function LocationPage() {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_MOCK_LOCATIONS);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Dialog State (untuk preview layout modal)
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<LocationItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LocationItem | null>(null);

  // Form temporary state (mocking input layout)
  const [formNama, setFormNama] = useState("");
  const [formSpesifik, setFormSpesifik] = useState("");

  const filteredLocations = useMemo(() => {
    if (!search.trim()) return locations;
    const q = search.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.namaLokasi.toLowerCase().includes(q) ||
        (loc.spesifikLetak && loc.spesifikLetak.toLowerCase().includes(q))
    );
  }, [locations, search]);

  const handleOpenCreate = () => {
    setFormNama("");
    setFormSpesifik("");
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (loc: LocationItem) => {
    setEditTarget(loc);
    setFormNama(loc.namaLokasi);
    setFormSpesifik(loc.spesifikLetak ?? "");
    setIsEditOpen(true);
  };

  // Mock submit handlers (layout preview)
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;
    const newItem: LocationItem = {
      id: Date.now(),
      namaLokasi: formNama.trim(),
      spesifikLetak: formSpesifik.trim() || null,
    };
    setLocations((prev) => [newItem, ...prev]);
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget || !formNama.trim()) return;
    setLocations((prev) =>
      prev.map((item) =>
        item.id === editTarget.id
          ? {
              ...item,
              namaLokasi: formNama.trim(),
              spesifikLetak: formSpesifik.trim() || null,
            }
          : item
      )
    );
    setIsEditOpen(false);
    setEditTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setLocations((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const isEmpty = filteredLocations.length === 0;

  return (
    <div className="space-y-4">
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
            {filteredLocations.map((lokasi) => (
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
                      <p className="truncate font-medium">{lokasi.namaLokasi}</p>
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
                      onClick={() => setDeleteTarget(lokasi)}
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
        {isEmpty && (
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

      {/* ── Footer Tabel / Paginasi ── */}
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Menampilkan{" "}
          <span className="font-mono tabular-nums">
            {filteredLocations.length}
          </span>{" "}
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
            isDisabled={true}
            onClick={() => setPage((p) => p + 1)}
          >
            Selanjutnya
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* ── Dialog Tambah Lokasi (Layout Modal) ── */}
      <Dialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogHeader>
          <DialogTitle>Tambah Lokasi Penyimpanan</DialogTitle>
          <DialogDescription>
            Tentukan area penyimpanan baru dan spesifikasi posisi barang di rak
            atau laci kerja.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="namaLokasi"
              className="text-xs font-medium text-muted-foreground"
            >
              Nama Lokasi <span className="text-destructive">*</span>
            </label>
            <Input
              id="namaLokasi"
              placeholder="mis. Rak Komponen 25 Laci, Meja Solder"
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="spesifikLetak"
              className="text-xs font-medium text-muted-foreground"
            >
              Spesifik Letak (Opsional)
            </label>
            <Input
              id="spesifikLetak"
              placeholder="mis. Laci No. 12, Kotak Perkakas, Rak 2"
              value={formSpesifik}
              onChange={(e) => setFormSpesifik(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
            >
              Batalkan
            </Button>
            <Button type="submit">Simpan Lokasi</Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* ── Dialog Edit Lokasi (Layout Modal) ── */}
      <Dialog isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogHeader>
          <DialogTitle>Edit Lokasi Penyimpanan</DialogTitle>
          <DialogDescription>
            Perbarui nama atau penunjuk letak rak penyimpanan ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="editNamaLokasi"
              className="text-xs font-medium text-muted-foreground"
            >
              Nama Lokasi <span className="text-destructive">*</span>
            </label>
            <Input
              id="editNamaLokasi"
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="editSpesifikLetak"
              className="text-xs font-medium text-muted-foreground"
            >
              Spesifik Letak (Opsional)
            </label>
            <Input
              id="editSpesifikLetak"
              value={formSpesifik}
              onChange={(e) => setFormSpesifik(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditOpen(false)}
            >
              Batalkan
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* ── Dialog Hapus Lokasi (AlertDialog Layout) ── */}
      <AlertDialog
        isOpen={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TriangleAlert className="size-6 text-destructive" aria-hidden="true" />
          </AlertDialogMedia>
          <AlertDialogTitle>Hapus lokasi penyimpanan?</AlertDialogTitle>
          <AlertDialogDescription>
            Lokasi “{deleteTarget?.namaLokasi ?? ""}” akan dihapus. Barang yang
            terkait dengan lokasi ini akan kehilangan tautan lokasinya.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batalkan</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onPress={handleDeleteConfirm}
          >
            Hapus Lokasi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
}