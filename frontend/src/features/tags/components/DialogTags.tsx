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
import { TagForm } from "./DialogForm";
import type { TagSchema } from "../schema";
import type { Tag } from "../types";

interface CreateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: TagSchema) => void;
}

export function CreateTagDialog({
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: CreateTagDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Tambah Tag Baru</DialogTitle>
        <DialogDescription>
          Buat label baru yang dapat dilampirkan ke berbagai alat dan bahan.
        </DialogDescription>
      </DialogHeader>

      <TagForm
        submitLabel="Simpan Tag"
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}

interface UpdateTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  /** Null sampai target edit dipilih; form cuma dirender bila target tersedia. */
  defaultValues: TagSchema | null;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: TagSchema) => void;
}

export function UpdateTagDialog({
  open,
  onOpenChange,
  isPending,
  defaultValues,
  onSubmit,
}: UpdateTagDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Edit Tag</DialogTitle>
        <DialogDescription>
          Ubah nama tag. Perubahan akan berlaku pada seluruh barang yang
          menggunakan tag ini.
        </DialogDescription>
      </DialogHeader>

      {defaultValues && (
        <TagForm
          defaultValues={defaultValues}
          submitLabel="Simpan Perubahan"
          isPending={isPending}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
}

interface DeleteTagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Tag yang akan dihapus; null bila dialog lagi tertutup. */
  target: Tag | null;
  isPending?: boolean;
  /** Dipanggil saat user konfirm hapus; pemanggilan API dilakukan di hook/page. */
  onConfirm: (tag: Tag) => void;
}

export function DeleteTagDialog({
  open,
  onOpenChange,
  target,
  isPending,
  onConfirm,
}: DeleteTagDialogProps) {
  return (
    <AlertDialog isOpen={open} onOpenChange={onOpenChange}>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <TriangleAlert className="size-6" aria-hidden="true" />
        </AlertDialogMedia>
        <AlertDialogTitle>Hapus tag?</AlertDialogTitle>
        <AlertDialogDescription>
          Tag “{target?.namaTag ?? ""}” akan dihapus. Label ini akan dilepas
          dari seluruh alat & bahan yang menggunakannya. Aksi ini tidak dapat
          dibatalkan.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batalkan</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          isDisabled={isPending}
          onPress={() => {
            if (target) onConfirm(target);
          }}
        >
          {isPending ? "Hapus..." : "Hapus Tag"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
}
