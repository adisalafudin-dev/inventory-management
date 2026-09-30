import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Tag as TagIcon,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag,
  useGetItemForTags,
} from "@/features/tags/hooks/useTag";

import {
  CreateTagDialog,
  DeleteTagDialog,
  UpdateTagDialog,
} from "@/features/tags/components/DialogTags";
import type {
  CreateTagPayload,
  Tag,
  UpdateTagPayload,
} from "@/features/tags/types";
import type { TagSchema } from "@/features/tags/schema";

export default function TagsPage() {
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  // Dialog state (untuk layout preview modal)
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<Tag | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Tag | null>(null);

  const { data } = useTags();

  const { mutate: createTag, isPending: isCreating } = useCreateTag();

  const { mutate: updateTag, isPending: isUpdating } = useUpdateTag();

  const { mutate: deleteTag, isPending: isDeleting } = useDeleteTag();

  const handleOpenCreate = () => {
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (tag: Tag) => {
    setEditTarget(tag);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = (values: CreateTagPayload) => {
    setIsCreateOpen(false);
    createTag(values, {
      onSuccess: () => setIsCreateOpen(false),
    });
  };

  const openEdit = (value: Tag) => {
    setIsEditOpen(true);
    setEditTarget(value);
  };

  const handleUpdate = (id: number, values: UpdateTagPayload) => {
    updateTag(
      { id: id, payload: values },
      {
        onSuccess: () => setIsEditOpen(false),
      },
    );
  };

  const handleEditSubmit = (values: TagSchema) => {
    if (!editTarget) return;
    handleUpdate(editTarget.id, values);
  };

  const handleDeleteConfirm = (tag: Tag) => {
    if (!deleteTarget) return;
    setDeleteTarget(tag);
    deleteTag(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* ── Header Halaman ── */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tag & Label</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola label atau penanda untuk mempermudah pengelompokan dan
            pencarian alat & bahan.
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
              placeholder="Cari tag..."
              className="w-full pl-9 sm:w-64"
              aria-label="Cari tag"
            />
          </div>

          {/* Tombol Tambah */}
          <Button onClick={handleOpenCreate}>
            <Plus className="size-4" aria-hidden="true" />
            Tambah Tag
          </Button>
        </div>
      </div>

      {/* ── Tabel Tag ── */}
      <div className="overflow-hidden border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted text-left text-xs text-muted-foreground">
              <th scope="col" className="px-3 py-2 font-medium">
                Nama Tag
              </th>
              <th
                scope="col"
                className="hidden px-3 py-2 font-medium sm:table-cell"
              >
                Pratinjau Badge
              </th>
              <th scope="col" className="w-24 px-3 py-2 text-right font-medium">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data?.map((tag: Tag) => (
              <tr key={tag.id} className="transition-colors hover:bg-muted/60">
                {/* Nama Tag */}
                <td className="h-11 px-3 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <TagIcon className="size-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-mono font-medium">
                        #{tag.namaTag}
                      </p>
                      {/* Sub-label di layar mobile */}
                      <div className="mt-0.5 sm:hidden">
                        <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                          #{tag.namaTag}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Pratinjau Badge */}
                <td className="hidden px-3 py-2 sm:table-cell">
                  <span className="inline-flex items-center rounded-md border border-border bg-muted/60 px-2.5 py-0.5 font-mono text-xs text-foreground">
                    #{tag.namaTag}
                  </span>
                </td>

                {/* Tombol Aksi */}
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(tag)}
                      type="button"
                      title={`Edit ${tag.namaTag}`}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="size-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(tag)}
                      title={`Hapus ${tag.namaTag}`}
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
        {data?.length === 0 && (
          <div className="flex flex-col items-center gap-3 px-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-md border border-dashed border-border bg-muted text-muted-foreground">
              {search ? (
                <Search className="size-5" aria-hidden="true" />
              ) : (
                <TagIcon className="size-5" aria-hidden="true" />
              )}
            </span>
            {search ? (
              <>
                <p className="text-sm font-medium">
                  Tidak ada tag yang cocok dengan “{search}”.
                </p>
                <p className="text-sm text-muted-foreground">
                  Coba kata kunci lain, atau kosongkan kolom pencarian.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">Belum ada tag.</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Tambah tag pertama untuk mulai menandai dan memudahkan
                  pencarian alat & bahan — misalnya “sensor” atau “waterproof”.
                </p>
                <Button
                  variant="outline"
                  className="mt-1"
                  onClick={handleOpenCreate}
                >
                  <Plus className="size-4" aria-hidden="true" />
                  Tambah Tag
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
          <span className="font-mono tabular-nums">{data?.length}</span> tag
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

      {/* ── Dialog Tambah Tag ── */}
      <CreateTagDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreateSubmit}
        isPending={isCreating}
      />

      {/* ── Dialog Edit Tag ── */}
      <UpdateTagDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        defaultValues={
          editTarget
            ? {
                namaTag: editTarget.namaTag,
              }
            : null
        }
        onSubmit={handleEditSubmit}
        isPending={isUpdating}
      />

      {/* ── Dialog Hapus Tag ── */}
      <DeleteTagDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        target={deleteTarget}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  );
}
