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
import { LocationForm } from "./LocationForm";
import type { LocationSchema } from "../schema";
import type { Location } from "../types";

interface CreateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: LocationSchema) => void;
}

export function CreateLocationDialog({
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: CreateLocationDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Tambah Lokasi</DialogTitle>
        <DialogDescription>
          Buat lokasi baru untuk alat & bahan — misalnya “Rak Laci” atau “Box
          Perkakas”.
        </DialogDescription>
      </DialogHeader>

      <LocationForm
        submitLabel="Simpan Lokasi"
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}

interface UpdateLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  defaultValues: LocationSchema | null;
  onSubmit: (values: LocationSchema) => void;
}

export function UpdateLocationDialog({
  open,
  onOpenChange,
  isPending,
  defaultValues,
  onSubmit,
}: UpdateLocationDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Edit Lokasi</DialogTitle>
        <DialogDescription>
          Perbarui data lokasi. Barang sudah terkait tidak berubah.
        </DialogDescription>
      </DialogHeader>

      {defaultValues && (
        <LocationForm
          defaultValues={defaultValues}
          submitLabel="Simpan Perubahan"
          isPending={isPending}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
}

interface DeleteLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Kategori yang akan dihapus; null bila dialog lagi tertutup. */
  target: Location | null;
  isPending?: boolean;
  /** Dipanggil saat user konfirm hapus; pemanggilan API dilakukan di hook/page. */
  onConfirm: () => void;
}

export function DeleteLocationDialog({
  open,
  onOpenChange,
  target,
  isPending,
  onConfirm,
}: DeleteLocationDialogProps) {
  return (
    <AlertDialog isOpen={open} onOpenChange={onOpenChange}>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <TriangleAlert className="size-6" aria-hidden="true" />
        </AlertDialogMedia>
        <AlertDialogTitle>Hapus Lokasi</AlertDialogTitle>
        <AlertDialogDescription>
          Lokasi “{target?.namaLokasi ?? ""}” akan dihapus permanen. Aksi ini
          tidak bisa diundo.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Batalkan</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          isDisabled={isPending}
          onPress={onConfirm}
        >
          {isPending ? "Hapus..." : "Hapus Lokasi"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
}
