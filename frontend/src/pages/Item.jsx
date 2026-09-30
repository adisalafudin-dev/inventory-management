import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  Wrench,
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
/*  Placeholder data layout — ganti dengan hook API (mis. useAlatBahan)*/
/*  saat integrasi data backend sudah siap.                           */
/* ------------------------------------------------------------------ */

const MOCK_CATEGORIES = [
  "Komponen IoT & Sensor",
  "Perkakas & Ukur",
  "Peralatan Bengkel",
  "Bahan Habis Pakai",
  "Elektronik & PCB",
];

const MOCK_LOCATIONS = [
  { namaLokasi: "Rak Komponen 25 Laci", spesifikLetak: "Laci No. 12" },
  { namaLokasi: "Meja Solder & Kerja", spesifikLetak: "Kotak Perkakas Tengah" },
  { namaLokasi: "Lemari Besi A", spesifikLetak: "Tingkat 2 / Sisi Kiri" },
  { namaLokasi: "Rak Bahan Habis Pakai", spesifikLetak: "Toples Baut M6" },
  {
    namaLokasi: "Gudang Belakang - Rak D",
    spesifikLetak: "Kardus Modul Sensor",
  },
];

const INITIAL_MOCK_ITEMS = [
  {
    id: "item-1",
    namaBarang: "Sensor Suhu DS18B20 Waterproof",
    kuantitas: 24,
    kondisi: "BAIK",
    namaKategori: "Komponen IoT & Sensor",
    namaLokasi: "Rak Komponen 25 Laci",
    spesifikLetak: "Laci No. 12",
    tags: ["sensor", "waterproof", "1-wire"],
  },
  {
    id: "item-2",
    namaBarang: "Multimeter Digital Fluke 101",
    kuantitas: 3,
    kondisi: "BAIK",
    namaKategori: "Perkakas & Ukur",
    namaLokasi: "Meja Solder & Kerja",
    spesifikLetak: "Kotak Perkakas Tengah",
    tags: ["alat ukur", "listrik"],
  },
  {
    id: "item-3",
    namaBarang: "Solder Listrik 60W Adjustable Temp",
    kuantitas: 1,
    kondisi: "RUSAK",
    namaKategori: "Peralatan Bengkel",
    namaLokasi: "Meja Solder & Kerja",
    spesifikLetak: "Meja Utama",
    tags: ["solder", "elemen rusak"],
  },
  {
    id: "item-4",
    namaBarang: "Tang Potong Presisi Plato 170",
    kuantitas: 4,
    kondisi: "KARATAN",
    namaKategori: "Perkakas & Ukur",
    namaLokasi: "Meja Solder & Kerja",
    spesifikLetak: "Gantungan Tool",
    tags: ["tang", "perlu pelumas"],
  },
  {
    id: "item-5",
    namaBarang: "Kabel Jumper Male-to-Female 20cm",
    kuantitas: 150,
    kondisi: "BAIK",
    namaKategori: "Bahan Habis Pakai",
    namaLokasi: "Lemari Besi A",
    spesifikLetak: "Tingkat 2 / Sisi Kiri",
    tags: ["kabel", "breadboard", "jumper"],
  },
  {
    id: "item-6",
    namaBarang: "Baut M6 × 20 mm Stainless Steel",
    kuantitas: 500,
    kondisi: "BAIK",
    namaKategori: "Bahan Habis Pakai",
    namaLokasi: "Rak Bahan Habis Pakai",
    spesifikLetak: "Toples Baut M6",
    tags: ["baut", "m6", "hardware"],
  },
];

export default function Item() {
  const [items, setItems] = useState(INITIAL_MOCK_ITEMS);
  const [search, setSearch] = useState("");
  const [kondisiFilter, setKondisiFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  // Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditTarget(item);

    setIsEditOpen(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaBarang.trim()) return;

    const parsedTags = formData.tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setItems((prev) => [newItem, ...prev]);
    setIsCreateOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editTarget || !formData.namaBarang.trim()) return;

    const parsedTags = formData.tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    setItems((prev) =>
      prev.map((item) =>
        item.id === editTarget.id
          ? {
              ...item,
              namaBarang: formData.namaBarang.trim(),
              kuantitas: Number(formData.kuantitas) || 0,
              kondisi: formData.kondisi,
              namaKategori: formData.namaKategori,
              namaLokasi: formData.namaLokasi,
              spesifikLetak: formData.spesifikLetak || null,
              tags: parsedTags,
            }
          : item,
      ),
    );
    setIsEditOpen(false);
    setEditTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <></>
    // <div className="space-y-4">
    //   {/* ── Header Halaman ── */}
    //   <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
    //     <div>
    //       <h1 className="text-2xl font-semibold tracking-tight">
    //         Alat & Bahan
    //       </h1>
    //       <p className="mt-1 text-sm text-muted-foreground">
    //         Daftar seluruh perkakas, komponen, dan bahan kerja beserta jumlah
    //         stok, kondisi, dan lokasi penyimpanannya.
    //       </p>
    //     </div>

    //     <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
    //       {/* Pencarian */}
    //       <div className="relative">
    //         <Search
    //           className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
    //           aria-hidden="true"
    //         />
    //         <Input
    //           value={search}
    //           onChange={(e) => {
    //             setSearch(e.target.value);
    //             setPage(1);
    //           }}
    //           placeholder="Cari alat atau bahan..."
    //           className="w-full pl-9 sm:w-60"
    //           aria-label="Cari alat atau bahan"
    //         />
    //       </div>

    //       {/* Filter Kondisi */}
    //       <select
    //         value={kondisiFilter}
    //         onChange={(e) => {
    //           setKondisiFilter(e.target.value);
    //           setPage(1);
    //         }}
    //         className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    //         aria-label="Filter kondisi barang"
    //       >
    //         <option value="ALL">Semua Kondisi</option>
    //         <option value="BAIK">Kondisi Baik</option>
    //         <option value="KARATAN">Kondisi Karatan</option>
    //         <option value="RUSAK">Kondisi Rusak</option>
    //       </select>

    //       {/* Tombol Tambah */}
    //       <Button onClick={handleOpenCreate}>
    //         <Plus className="size-4" aria-hidden="true" />
    //         Tambah Alat / Bahan
    //       </Button>
    //     </div>
    //   </div>

    //   {/* ── Tabel Alat & Bahan ── */}
    //   <div className="overflow-hidden border border-border bg-card">
    //     <table className="w-full text-sm">
    //       <thead>
    //         <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
    //           <th scope="col" className="px-3 py-2 font-medium">
    //             Nama Barang & Tag
    //           </th>
    //           <th
    //             scope="col"
    //             className="hidden px-3 py-2 font-medium md:table-cell"
    //           >
    //             Kategori
    //           </th>
    //           <th
    //             scope="col"
    //             className="hidden px-3 py-2 font-medium lg:table-cell"
    //           >
    //             Lokasi Penyimpanan
    //           </th>
    //           <th scope="col" className="px-3 py-2 font-medium">
    //             Kondisi
    //           </th>
    //           <th scope="col" className="px-3 py-2 text-right font-medium">
    //             Kuantitas
    //           </th>
    //           <th scope="col" className="w-20 px-3 py-2 text-right font-medium">
    //             Aksi
    //           </th>
    //         </tr>
    //       </thead>
    //       <tbody className="divide-y divide-border">
    //         {filteredItems.map((item) => {
    //           const isLowStock = item.kuantitas < 5;

    //           return (
    //             <tr
    //               key={item.id}
    //               className="transition-colors hover:bg-muted/60"
    //             >
    //               {/* Nama Barang + Tags */}
    //               <td className="h-11 px-3 py-2">
    //                 <div className="flex items-center gap-2.5">
    //                   <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
    //                     <Wrench className="size-4" aria-hidden="true" />
    //                   </span>
    //                   <div className="min-w-0">
    //                     <p className="truncate font-medium">
    //                       {item.namaBarang}
    //                     </p>
    //                     {/* Info Lokasi & Kategori di Mobile */}
    //                     <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground md:hidden">
    //                       <span>{item.namaKategori}</span>
    //                       <span>·</span>
    //                       <span className="flex items-center gap-1">
    //                         <MapPin className="size-3" />
    //                         {item.namaLokasi}
    //                       </span>
    //                     </div>
    //                     {/* Tag list */}
    //                     {item.tags && item.tags.length > 0 && (
    //                       <div className="mt-0.5 hidden flex-wrap gap-1 sm:flex">
    //                         {item.tags.map((tag) => (
    //                           <span
    //                             key={tag}
    //                             className="font-mono text-[10px] text-muted-foreground"
    //                           >
    //                             #{tag}
    //                           </span>
    //                         ))}
    //                       </div>
    //                     )}
    //                   </div>
    //                 </div>
    //               </td>

    //               {/* Kategori */}
    //               <td className="hidden px-3 py-2 md:table-cell">
    //                 <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground">
    //                   {item.namaKategori}
    //                 </span>
    //               </td>

    //               {/* Lokasi */}
    //               <td className="hidden max-w-xs px-3 py-2 lg:table-cell">
    //                 <div className="flex items-start gap-1.5 text-xs">
    //                   <MapPin
    //                     className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
    //                     aria-hidden="true"
    //                   />
    //                   <div className="min-w-0">
    //                     <p className="truncate font-medium">
    //                       {item.namaLokasi}
    //                     </p>
    //                     {item.spesifikLetak && (
    //                       <p className="truncate text-muted-foreground">
    //                         {item.spesifikLetak}
    //                       </p>
    //                     )}
    //                   </div>
    //                 </div>
    //               </td>

    //               {/* Kondisi Badge */}
    //               <td className="px-3 py-2">
    //                 {item.kondisi === "BAIK" && (
    //                   <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
    //                     <CircleCheck className="size-3" aria-hidden="true" />
    //                     Baik
    //                   </span>
    //                 )}
    //                 {item.kondisi === "KARATAN" && (
    //                   <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/15 px-2 py-0.5 text-xs font-medium text-warning">
    //                     <TriangleAlert className="size-3" aria-hidden="true" />
    //                     Karatan
    //                   </span>
    //                 )}
    //                 {item.kondisi === "RUSAK" && (
    //                   <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/15 px-2 py-0.5 text-xs font-medium text-destructive">
    //                     <CircleX className="size-3" aria-hidden="true" />
    //                     Rusak
    //                   </span>
    //                 )}
    //               </td>

    //               {/* Kuantitas Stok */}
    //               <td className="px-3 py-2 text-right">
    //                 <div className="flex items-center justify-end gap-1.5">
    //                   <span
    //                     className={`font-mono text-sm font-semibold tabular-nums ${
    //                       isLowStock ? "text-warning" : "text-foreground"
    //                     }`}
    //                   >
    //                     {item.kuantitas}
    //                   </span>
    //                   {isLowStock && (
    //                     <span className="inline-flex rounded-sm bg-warning/15 px-1.5 py-0.5 text-[10px] font-medium text-warning">
    //                       Menipis
    //                     </span>
    //                   )}
    //                 </div>
    //               </td>

    //               {/* Aksi */}
    //               <td className="px-3 py-2">
    //                 <div className="flex items-center justify-end gap-1">
    //                   <button
    //                     onClick={() => handleOpenEdit(item)}
    //                     type="button"
    //                     title={`Edit ${item.namaBarang}`}
    //                     className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    //                   >
    //                     <Pencil className="size-4" aria-hidden="true" />
    //                   </button>
    //                   <button
    //                     type="button"
    //                     onClick={() => setDeleteTarget(item)}
    //                     title={`Hapus ${item.namaBarang}`}
    //                     className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
    //                   >
    //                     <Trash2 className="size-4" aria-hidden="true" />
    //                   </button>
    //                 </div>
    //               </td>
    //             </tr>
    //           );
    //         })}
    //       </tbody>
    //     </table>

    //     {/* ── Empty State ── */}
    //     {isEmpty && (
    //       <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
    //         <span className="flex size-12 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
    //           {search || kondisiFilter !== "ALL" ? (
    //             <Search className="size-5" aria-hidden="true" />
    //           ) : (
    //             <Wrench className="size-5" aria-hidden="true" />
    //           )}
    //         </span>
    //         {search || kondisiFilter !== "ALL" ? (
    //           <>
    //             <p className="text-sm font-medium">
    //               Tidak ada barang yang cocok dengan kriteria pencarian.
    //             </p>
    //             <p className="text-sm text-muted-foreground">
    //               Coba kata kunci lain atau ubah filter status kondisi.
    //             </p>
    //           </>
    //         ) : (
    //           <>
    //             <p className="text-sm font-medium">
    //               Belum ada alat atau bahan.
    //             </p>
    //             <p className="max-w-sm text-sm text-muted-foreground">
    //               Catat alat, komponen, atau bahan kerja pertama Anda untuk
    //               mulai mengelola stok dan letak penyimpanannya.
    //             </p>
    //             <Button
    //               variant="outline"
    //               className="mt-1"
    //               onClick={handleOpenCreate}
    //             >
    //               <Plus className="size-4" aria-hidden="true" />
    //               Tambah Alat / Bahan
    //             </Button>
    //           </>
    //         )}
    //       </div>
    //     )}
    //   </div>

    //   {/* ── Footer Tabel / Paginasi ── */}
    //   <div className="flex items-center justify-between px-2">
    //     <p className="text-sm text-muted-foreground">
    //       Menampilkan{" "}
    //       <span className="font-mono tabular-nums">{filteredItems.length}</span>{" "}
    //       alat & bahan
    //     </p>
    //     <div className="flex gap-2">
    //       <Button
    //         variant="outline"
    //         size="sm"
    //         isDisabled={page <= 1}
    //         onClick={() => setPage((p) => p - 1)}
    //       >
    //         <ChevronLeft className="size-4" />
    //         Sebelumnya
    //       </Button>
    //       <Button
    //         variant="outline"
    //         size="sm"
    //         isDisabled={true}
    //         onClick={() => setPage((p) => p + 1)}
    //       >
    //         Selanjutnya
    //         <ChevronRight className="size-4" />
    //       </Button>
    //     </div>
    //   </div>

    //   {/* ── Dialog Tambah Alat / Bahan ── */}
    //   <Dialog isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}>
    //     <DialogHeader>
    //       <DialogTitle>Tambah Alat & Bahan</DialogTitle>
    //       <DialogDescription>
    //         Masukkan informasi perkakas atau bahan kerja baru beserta letak rak
    //         dan kuantitas awalnya.
    //       </DialogDescription>
    //     </DialogHeader>

    //     <form onSubmit={handleCreateSubmit} className="space-y-4">
    //       <div className="space-y-1.5">
    //         <label
    //           htmlFor="namaBarang"
    //           className="text-xs font-medium text-muted-foreground"
    //         >
    //           Nama Alat / Bahan <span className="text-destructive">*</span>
    //         </label>
    //         <Input
    //           id="namaBarang"
    //           placeholder="mis. Multimeter Digital Fluke 101, Sensor DS18B20"
    //           value={formData.namaBarang}
    //           onChange={(e) =>
    //             setFormData({ ...formData, namaBarang: e.target.value })
    //           }
    //           autoFocus
    //           required
    //         />
    //       </div>

    //       <div className="grid grid-cols-2 gap-3">
    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="kuantitas"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Kuantitas Stok <span className="text-destructive">*</span>
    //           </label>
    //           <Input
    //             id="kuantitas"
    //             type="number"
    //             min="0"
    //             value={formData.kuantitas}
    //             onChange={(e) =>
    //               setFormData({
    //                 ...formData,
    //                 kuantitas: Number(e.target.value),
    //               })
    //             }
    //             required
    //           />
    //         </div>

    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="kondisi"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Kondisi Barang <span className="text-destructive">*</span>
    //           </label>
    //           <select
    //             id="kondisi"
    //             value={formData.kondisi}
    //             onChange={(e) =>
    //               setFormData({ ...formData, kondisi: e.target.value })
    //             }
    //             className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    //           >
    //             <option value="BAIK">Baik</option>
    //             <option value="KARATAN">Karatan</option>
    //             <option value="RUSAK">Rusak</option>
    //           </select>
    //         </div>
    //       </div>

    //       <div className="grid grid-cols-2 gap-3">
    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="kategori"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Kategori <span className="text-destructive">*</span>
    //           </label>
    //           <select
    //             id="kategori"
    //             value={formData.namaKategori}
    //             onChange={(e) =>
    //               setFormData({ ...formData, namaKategori: e.target.value })
    //             }
    //             className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    //           >
    //             {MOCK_CATEGORIES.map((cat) => (
    //               <option key={cat} value={cat}>
    //                 {cat}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="lokasi"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Lokasi Penyimpanan <span className="text-destructive">*</span>
    //           </label>
    //           <select
    //             id="lokasi"
    //             value={formData.namaLokasi}
    //             onChange={(e) => {
    //               const found = MOCK_LOCATIONS.find(
    //                 (loc) => loc.namaLokasi === e.target.value,
    //               );
    //               setFormData({
    //                 ...formData,
    //                 namaLokasi: e.target.value,
    //                 spesifikLetak: found ? found.spesifikLetak : "",
    //               });
    //             }}
    //             className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    //           >
    //             {MOCK_LOCATIONS.map((loc) => (
    //               <option key={loc.namaLokasi} value={loc.namaLokasi}>
    //                 {loc.namaLokasi} ({loc.spesifikLetak})
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       </div>

    //       <div className="space-y-1.5">
    //         <label
    //           htmlFor="tags"
    //           className="text-xs font-medium text-muted-foreground"
    //         >
    //           Label / Tags (Pisahkan dengan koma)
    //         </label>
    //         <Input
    //           id="tags"
    //           placeholder="mis. sensor, waterproof, alat ukur"
    //           value={formData.tagsInput}
    //           onChange={(e) =>
    //             setFormData({ ...formData, tagsInput: e.target.value })
    //           }
    //         />
    //       </div>

    //       <DialogFooter className="mt-6 flex justify-end gap-2">
    //         <Button
    //           type="button"
    //           variant="outline"
    //           onClick={() => setIsCreateOpen(false)}
    //         >
    //           Batalkan
    //         </Button>
    //         <Button type="submit">Simpan Barang</Button>
    //       </DialogFooter>
    //     </form>
    //   </Dialog>

    //   {/* ── Dialog Edit Alat / Bahan ── */}
    //   <Dialog isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
    //     <DialogHeader>
    //       <DialogTitle>Edit Alat & Bahan</DialogTitle>
    //       <DialogDescription>
    //         Perbarui kuantitas stok, kondisi fisik, atau lokasi penyimpanan
    //         barang.
    //       </DialogDescription>
    //     </DialogHeader>

    //     <form onSubmit={handleEditSubmit} className="space-y-4">
    //       <div className="space-y-1.5">
    //         <label
    //           htmlFor="editNamaBarang"
    //           className="text-xs font-medium text-muted-foreground"
    //         >
    //           Nama Alat / Bahan <span className="text-destructive">*</span>
    //         </label>
    //         <Input
    //           id="editNamaBarang"
    //           value={formData.namaBarang}
    //           onChange={(e) =>
    //             setFormData({ ...formData, namaBarang: e.target.value })
    //           }
    //           required
    //         />
    //       </div>

    //       <div className="grid grid-cols-2 gap-3">
    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="editKuantitas"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Kuantitas Stok <span className="text-destructive">*</span>
    //           </label>
    //           <Input
    //             id="editKuantitas"
    //             type="number"
    //             min="0"
    //             value={formData.kuantitas}
    //             onChange={(e) =>
    //               setFormData({
    //                 ...formData,
    //                 kuantitas: Number(e.target.value),
    //               })
    //             }
    //             required
    //           />
    //         </div>

    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="editKondisi"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Kondisi Barang <span className="text-destructive">*</span>
    //           </label>
    //           <select
    //             id="editKondisi"
    //             value={formData.kondisi}
    //             onChange={(e) =>
    //               setFormData({ ...formData, kondisi: e.target.value })
    //             }
    //             className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    //           >
    //             <option value="BAIK">Baik</option>
    //             <option value="KARATAN">Karatan</option>
    //             <option value="RUSAK">Rusak</option>
    //           </select>
    //         </div>
    //       </div>

    //       <div className="grid grid-cols-2 gap-3">
    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="editKategori"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Kategori <span className="text-destructive">*</span>
    //           </label>
    //           <select
    //             id="editKategori"
    //             value={formData.namaKategori}
    //             onChange={(e) =>
    //               setFormData({ ...formData, namaKategori: e.target.value })
    //             }
    //             className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    //           >
    //             {MOCK_CATEGORIES.map((cat) => (
    //               <option key={cat} value={cat}>
    //                 {cat}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         <div className="space-y-1.5">
    //           <label
    //             htmlFor="editLokasi"
    //             className="text-xs font-medium text-muted-foreground"
    //           >
    //             Lokasi Penyimpanan <span className="text-destructive">*</span>
    //           </label>
    //           <select
    //             id="editLokasi"
    //             value={formData.namaLokasi}
    //             onChange={(e) => {
    //               const found = MOCK_LOCATIONS.find(
    //                 (loc) => loc.namaLokasi === e.target.value,
    //               );
    //               setFormData({
    //                 ...formData,
    //                 namaLokasi: e.target.value,
    //                 spesifikLetak: found ? found.spesifikLetak : "",
    //               });
    //             }}
    //             className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    //           >
    //             {MOCK_LOCATIONS.map((loc) => (
    //               <option key={loc.namaLokasi} value={loc.namaLokasi}>
    //                 {loc.namaLokasi} ({loc.spesifikLetak})
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //       </div>

    //       <div className="space-y-1.5">
    //         <label
    //           htmlFor="editTags"
    //           className="text-xs font-medium text-muted-foreground"
    //         >
    //           Label / Tags (Pisahkan dengan koma)
    //         </label>
    //         <Input
    //           id="editTags"
    //           value={formData.tagsInput}
    //           onChange={(e) =>
    //             setFormData({ ...formData, tagsInput: e.target.value })
    //           }
    //         />
    //       </div>

    //       <DialogFooter className="mt-6 flex justify-end gap-2">
    //         <Button
    //           type="button"
    //           variant="outline"
    //           onClick={() => setIsEditOpen(false)}
    //         >
    //           Batalkan
    //         </Button>
    //         <Button type="submit">Simpan Perubahan</Button>
    //       </DialogFooter>
    //     </form>
    //   </Dialog>

    //   {/* ── Dialog Hapus Alat / Bahan (AlertDialog) ── */}
    //   <AlertDialog
    //     isOpen={deleteTarget !== null}
    //     onOpenChange={(open) => {
    //       if (!open) setDeleteTarget(null);
    //     }}
    //   >
    //     <AlertDialogHeader>
    //       <AlertDialogMedia>
    //         <TriangleAlert
    //           className="size-6 text-destructive"
    //           aria-hidden="true"
    //         />
    //       </AlertDialogMedia>
    //       <AlertDialogTitle>Hapus alat & bahan?</AlertDialogTitle>
    //       <AlertDialogDescription>
    //         Barang “{deleteTarget?.namaBarang ?? ""}” akan dihapus dari catatan
    //         inventori beserta riwayat mutasinya. Aksi ini tidak dapat
    //         dibatalkan.
    //       </AlertDialogDescription>
    //     </AlertDialogHeader>
    //     <AlertDialogFooter>
    //       <AlertDialogCancel>Batalkan</AlertDialogCancel>
    //       <AlertDialogAction
    //         variant="destructive"
    //         onPress={handleDeleteConfirm}
    //       >
    //         Hapus Barang
    //       </AlertDialogAction>
    //     </AlertDialogFooter>
    //   </AlertDialog>
    // </div>
  );
}
