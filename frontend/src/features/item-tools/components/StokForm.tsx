import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { stokSchema, type StokSchema } from "../schema";

interface StokFormProps {
  submitLabel: string;
  isPending?: boolean;
  onSubmit: (values: StokSchema) => void;
}

export function StokForm({ submitLabel, isPending, onSubmit }: StokFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StokSchema>({ resolver: zodResolver(stokSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="jumlah"
          className="text-xs font-medium text-muted-foreground"
        >
          Jumlah
        </label>
        <Input
          id="jumlah"
          type="number"
          min={1}
          aria-invalid={!!errors.jumlah}
          {...register("jumlah", { valueAsNumber: true })}
        />
        {errors.jumlah && (
          <p className="text-xs text-destructive">{errors.jumlah.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="keterangan"
          className="text-xs font-medium text-muted-foreground"
        >
          Keterangan <span className="font-normal">(opsional)</span>
        </label>
        <Textarea id="keterangan" rows={2} {...register("keterangan")} />
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Button type="submit" isDisabled={isPending}>
          {isPending ? "Memproses..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
