import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  categorySchema,
  type CategorySchema,
} from "@/features/category/schema";

interface CategoryFormProps {
  submitLabel?: string;
  isPending?: boolean;
  defaultValues?: Partial<CategorySchema>;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: CategorySchema) => void;
}

export function CategoryForm({
  submitLabel = "Simpan Kategori",
  isPending = false,
  defaultValues,
  onSubmit,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="nama-kategori"
          className="text-xs font-medium text-muted-foreground"
        >
          Nama Kategori
        </label>
        <Input
          id="nama-kategori"
          placeholder="mis. Elektronik"
          autoComplete="off"
          aria-invalid={!!errors.namaKategori}
          {...register("namaKategori")}
        />
        {errors.namaKategori && (
          <p className="text-xs text-destructive">
            {errors.namaKategori.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="deskripsi-kategori"
          className="text-xs font-medium text-muted-foreground"
        >
          Deskripsi <span className="font-normal">(opsional)</span>
        </label>
        <Textarea
          id="deskripsi-kategori"
          placeholder="Catatan singkat isi kategori ini..."
          rows={3}
          aria-invalid={!!errors.deskripsi}
          {...register("deskripsi")}
        />
        {errors.deskripsi && (
          <p className="text-xs text-destructive">{errors.deskripsi.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" isDisabled={isPending}>
          {isPending ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
