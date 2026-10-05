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
import { DialogForm } from "./DialogForm";
import type { AlatBahanSchema, StokSchema } from "../schema";
import type { AlatBahan } from "../types";
import { StokForm } from "./StokForm";

interface CreateAlatBahanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  onSubmit: (values: AlatBahanSchema) => void;
}

export function CreateAlatBahanDialog({
  open,
  onOpenChange,
  isPending,
  onSubmit,
}: CreateAlatBahanDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Tambah Alat & Bahan</DialogTitle>
        <DialogDescription>
          Masukkan informasi perkakas atau bahan kerja baru beserta letak rak
          dan kuantitas awalnya.
        </DialogDescription>
      </DialogHeader>

      <DialogForm
        submitLabel="Simpan Barang"
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}

interface UpdateAlatBahanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  defaultValues: Partial<AlatBahanSchema> | null;
  onSubmit: (values: AlatBahanSchema) => void;
}

export function UpdateAlatBahanDialog({
  open,
  onOpenChange,
  isPending,
  defaultValues,
  onSubmit,
}: UpdateAlatBahanDialogProps) {
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>Edit Alat & Bahan</DialogTitle>
        <DialogDescription>
          Perbarui informasi kuantitas, kondisi fisik, atau lokasi penyimpanan
          barang.
        </DialogDescription>
      </DialogHeader>

      {defaultValues && (
        <DialogForm
          defaultValues={defaultValues}
          submitLabel="Simpan Perubahan"
          isPending={isPending}
          onSubmit={onSubmit}
        />
      )}
    </Dialog>
  );
}

interface DeleteAlatBahanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: AlatBahan | null;
  isPending?: boolean;
  onConfirm: (item: AlatBahan) => void;
}

export function DeleteAlatBahanDialog({
  open,
  onOpenChange,
  target,
  isPending,
  onConfirm,
}: DeleteAlatBahanDialogProps) {
  return (
    <AlertDialog isOpen={open} onOpenChange={onOpenChange}>
      <AlertDialogHeader>
        <AlertDialogMedia>
          <TriangleAlert
            className="size-6 text-destructive"
            aria-hidden="true"
          />
        </AlertDialogMedia>
        <AlertDialogTitle>Hapus alat & bahan?</AlertDialogTitle>
        <AlertDialogDescription>
          Barang “{target?.namaBarang ?? ""}” akan dihapus dari catatan
          inventori. Aksi ini tidak dapat dibatalkan.
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
          {isPending ? "Hapus..." : "Hapus Barang"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialog>
  );
}

interface StokDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: AlatBahan | null;
  mode: "increase" | "decrease";
  isPending?: boolean;
  onSubmit: (values: StokSchema) => void;
}

export function StokDialog({
  open,
  onOpenChange,
  target,
  mode,
  isPending,
  onSubmit,
}: StokDialogProps) {
  const isIncrease = mode === "increase";
  return (
    <Dialog isOpen={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{isIncrease ? "Tambah Stok" : "Kurangi Stok"}</DialogTitle>
        <DialogDescription>
          {target?.namaBarang} — stok saat ini {target?.kuantitas ?? 0}
        </DialogDescription>
      </DialogHeader>
      <StokForm
        submitLabel={isIncrease ? "Tambah Stok" : "Kurangi Stok"}
        isPending={isPending}
        onSubmit={onSubmit}
      />
    </Dialog>
  );
}

export { ItemHistoryDialog } from "./ItemHistoryDialog";
