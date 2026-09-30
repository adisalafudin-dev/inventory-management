import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { locationSchema, type LocationSchema } from "../schema";

interface LocationFormProps {
  submitLabel?: string;
  isPending?: boolean;
  defaultValues?: Partial<LocationSchema>;
  /** Dipanggil saat form valid; pemanggilan API dilakukan di hook/page. */
  onSubmit: (values: LocationSchema) => void;
}

export function LocationForm({
  submitLabel = "Simpan Lokasi",
  isPending = false,
  defaultValues,
  onSubmit,
}: LocationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LocationSchema>({
    resolver: zodResolver(locationSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="nama-lokasi"
          className="text-xs font-medium text-muted-foreground"
        >
          Nama Lokasi
        </label>
        <Input
          id="nama-lokasi"
          placeholder="mis. Rak Laci"
          autoComplete="off"
          aria-invalid={!!errors.namaLokasi}
          {...register("namaLokasi")}
        />
        {errors.namaLokasi && (
          <p className="text-xs text-destructive">
            {errors.namaLokasi.message}
          </p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="spesifik-letak"
          className="text-xs font-medium text-muted-foreground"
        >
          Spesifikasi Letak
        </label>
        <Textarea
          id="spesifik-letak"
          placeholder="Spesifikasi letak dari lokasi ini mis. Rak Laci A"
          rows={3}
          aria-invalid={!!errors.spesifikLetak}
          {...register("spesifikLetak")}
        />
        {errors.spesifikLetak && (
          <p className="text-xs text-destructive">
            {errors.spesifikLetak.message}
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
