import { useState } from "react";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/features/category/hooks/useCategories";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  CreateCategoryDialog,
  DeleteCategoryDialog,
  UpdateCategoryDialog,
} from "@/features/category/components/CategoryDialog";
import type {
  Category,
  UpdateCategoryPayload,
} from "@/features/category/types";
import type { CategorySchema } from "@/features/category/schema";

export default function CategoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data } = useCategories({
    page: page,
    limit: 10,
    search: debouncedSearch,
  });

  const categories = data?.data ?? [];
  const meta = data?.meta;

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const openEdit = (value: Category) => {
    setIsEditOpen(true);
    setEditTarget(value);
  };

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();

  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const handleCreate = (values: Parameters<typeof createCategory>[0]) => {
    createCategory(values, {
      onSuccess: () => setIsOpen(false),
    });
  };

  const handleUpdate = (id: number, values: UpdateCategoryPayload) => {
    updateCategory(
      { id: id, payload: values },
      {
        onSuccess: () => setIsEditOpen(false),
      },
    );
  };

  const handleEditSubmit = (values: CategorySchema) => {
    if (!editTarget) return;
    handleUpdate(editTarget.id, values);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  const isEmpty = categories.length === 0;

  return (
    <div className="space-y-4">
      {/* Header halaman */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Kategori</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelompokkan alat & bahan supaya pencarian dan stok lebih mudah
            dipantau.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari kategori..."
              className="w-full pl-9 sm:w-64"
              aria-label="Cari kategori"
            />
          </div>
          {/* TODO: buka form/dialog tambah kategori */}
          <Button onClick={() => setIsOpen(!isOpen)}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah Kategori
          </Button>
        </div>
      </div>

      <CreateCategoryDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        isPending={isCreating}
        onSubmit={handleCreate}
      />

      <UpdateCategoryDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        isPending={isUpdating}
        onSubmit={handleEditSubmit}
        defaultValues={
          editTarget
            ? {
                namaKategori: editTarget.namaKategori,
                deskripsi: editTarget.deskripsi ?? "",
              }
            : null
        }
      />

      <DeleteCategoryDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        target={deleteTarget}
        isPending={isDeleting}
        onConfirm={handleDelete}
      />

      {/* Tabel kategori */}
      <div className="overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Nama Kategori
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2 font-medium md:table-cell"
              >
                Deskripsi
              </th>

              <th scope="col" className="w-24 px-3 py-2 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((kategori) => (
              <tr
                key={kategori.id}
                className="transition-colors hover:bg-muted/60"
              >
                <td className="h-11 px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Boxes className="size-4" aria-hidden="true" />
                    </span>
                    <span className="truncate font-medium">
                      {kategori.namaKategori}
                    </span>
                  </div>
                </td>
                <td className="hidden max-w-md px-3 py-2 md:table-cell">
                  <span className="line-clamp-1 text-muted-foreground">
                    {kategori.deskripsi}
                  </span>
                </td>

                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    {/* TODO: buka form edit kategori */}
                    <button
                      onClick={() => openEdit(kategori)}
                      type="button"
                      title={`Edit ${kategori.namaKategori}`}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    {/* TODO: konfirmasi lalu hapus kategori */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(kategori)}
                      title={`Hapus ${kategori.namaKategori}`}
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

        {/* Empty state — actionable, bukan sekadar "data tidak ditemukan" */}
        {isEmpty && (
          <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
              {search ? (
                <Search className="size-5" aria-hidden="true" />
              ) : (
                <Tag className="size-5" aria-hidden="true" />
              )}
            </span>
            {search ? (
              <>
                <p className="text-sm font-medium">
                  Tidak ada kategori yang cocok dengan “{search}”.
                </p>
                <p className="text-sm text-muted-foreground">
                  Coba kata kunci lain, atau kosongkan pencarian.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">Belum ada kategori.</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Tambah kategori pertama untuk mulai mengelompokkan alat &
                  bahan — misalnya “Elektronik” atau “Perkakas”.
                </p>
                {/* TODO: buka form/dialog tambah kategori */}
                <Button variant="outline" className="mt-1">
                  <Plus className="size-4" aria-hidden="true" />
                  Tambah Kategori
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer tabel */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Halaman {meta.page} dari {meta.totalPages} ({meta.total} total
            kategori)
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
