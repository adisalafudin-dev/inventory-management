import { TriangleAlert } from "lucide-react";
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
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/features/category/components/CategoryForm";
import type { Category } from "@/features/category/types";
import type { CategorySchema } from "@/features/category/schema";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: CategorySchema) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: CreateCategoryDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Tambah Kategori</DialogTitle>
        <DialogDescription>
          Buat pengelompokan baru untuk alat & bahan — misalnya “Elektronik”
          atau “Perkakas”.
        </DialogDescription>
      </DialogHeader>

      <CategoryForm
        submitLabel="Simpan Kategori"
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}

interface UpdateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  /** Null sampai target edit dipilih; form cuma dirender bila target tersedia. */
  defaultValues: Pick<CategorySchema, "namaKategori" | "deskripsi"> | null;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: CategorySchema) => void;
}

export function UpdateCategoryDialog({
  open,
  onOpenChange,
  isPending,
  defaultValues,
  onSubmit,
}: UpdateCategoryDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Edit Kategori</DialogTitle>
        <DialogDescription>
          Perbarui nama atau deskripsi kategori. Barang yang sudah terkait tidak
          berubah.
        </DialogDescription>
      </DialogHeader>

      {defaultValues && (
        <CategoryForm
          defaultValues={defaultValues}
          submitLabel="Simpan Perubahan"
          isPending={isPending}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
}

interface DeleteCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Kategori yang akan dihapus; null bila dialog lagi tertutup. */
  target: Category | null;
  isPending?: boolean;
  /** Dipanggil saat user konfirm hapus; pemanggilan API dilakukan di hook/page. */
  onConfirm: () => void;
}

export function DeleteCategoryDialog({
  open,
  onOpenChange,
  target,
  isPending,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <AlertDialog isOpen={open} onOpenChange={onOpenChange}>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <TriangleAlert className="size-6" aria-hidden="true" />
        </AlertDialogMedia>
        <AlertDialogTitle>Hapus kategori?</AlertDialogTitle>
        <AlertDialogDescription>
          Kategori “{target?.namaKategori ?? ""}” akan dihapus permanen. Aksi
          ini tidak bisa diundo.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batalkan</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          isDisabled={isPending}
          onPress={onConfirm}
        >
          {isPending ? "Hapus..." : "Hapus Kategori"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
}
