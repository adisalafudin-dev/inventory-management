import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tagSchema, type TagSchema } from "@/features/tags/schema";

interface DialogFormProps {
  submitLabel?: string;
  isPending?: boolean;
  defaultValues?: Partial<TagSchema>;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: TagSchema) => void;
}

export function DialogForm({
  submitLabel = "Simpan Tag",
  isPending = false,
  defaultValues,
  onSubmit,
}: DialogFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TagSchema>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      namaTag: defaultValues?.namaTag ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="nama-tag"
          className="text-xs font-medium text-muted-foreground"
        >
          Nama Tag <span className="text-destructive">*</span>
        </label>
        <Input
          id="nama-tag"
          placeholder="mis. sensor, waterproof, smd"
          autoComplete="off"
          autoFocus
          aria-invalid={!!errors.namaTag}
          {...register("namaTag")}
        />
        {errors.namaTag ? (
          <p className="text-xs text-destructive">{errors.namaTag.message}</p>
        ) : (
          <p className="text-[11px] text-muted-foreground">
            Gunakan huruf kecil atau tanda hubung untuk memisahkan kata.
          </p>
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

export const TagForm = DialogForm;
