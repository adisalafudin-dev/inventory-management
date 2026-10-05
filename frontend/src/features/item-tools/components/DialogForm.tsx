import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  alatBahanSchema,
  type AlatBahanSchema,
} from "@/features/item-tools/schema";
import { useCategories } from "@/features/category/hooks/useCategories";
import { useLocations } from "@/features/location/hooks/useLocation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTags } from "@/features/tags/hooks/useTag";
import { TagPicker } from "./TagPicker";

interface DialogFormProps {
  submitLabel?: string;
  isPending?: boolean;
  defaultValues?: Partial<AlatBahanSchema>;
  onSubmit: (values: AlatBahanSchema) => void;
}

export function DialogForm({
  submitLabel = "Simpan Barang",
  isPending = false,
  defaultValues,
  onSubmit,
}: DialogFormProps) {
  const { data: categoryData } = useCategories({ limit: 50 });
  const { data: locationData } = useLocations({ limit: 100 });
  const { data: tagData } = useTags();

  const categories = categoryData?.data ?? [];
  const locations = locationData?.data ?? [];
  const tags = tagData ?? [];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AlatBahanSchema>({
    resolver: zodResolver(alatBahanSchema),
    defaultValues: {
      namaBarang: defaultValues?.namaBarang ?? "",
      kuantitas: defaultValues?.kuantitas ?? 1,
      kondisi: defaultValues?.kondisi ?? "BAIK",
      idKategori: defaultValues?.idKategori,
      idLokasi: defaultValues?.idLokasi,
      tagIds: defaultValues?.tagIds ?? [],
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) => console.log(errs))}
      className="space-y-4"
    >
      {/* Nama Barang */}
      <div className="space-y-1.5">
        <label
          htmlFor="namaBarang"
          className="text-xs font-medium text-muted-foreground"
        >
          Nama Alat / Bahan <span className="text-destructive">*</span>
        </label>
        <Input
          id="namaBarang"
          placeholder="mis. Multimeter Digital Fluke 101, Sensor DS18B20"
          autoComplete="off"
          autoFocus
          aria-invalid={!!errors.namaBarang}
          {...register("namaBarang")}
        />
        {errors.namaBarang && (
          <p className="text-xs text-destructive">
            {errors.namaBarang.message}
          </p>
        )}
      </div>

      {/* Kuantitas & Kondisi */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="kuantitas"
            className="text-xs font-medium text-muted-foreground"
          >
            Kuantitas Stok <span className="text-destructive">*</span>
          </label>
          <Input
            id="kuantitas"
            type="number"
            min="0"
            aria-invalid={!!errors.kuantitas}
            {...register("kuantitas", { valueAsNumber: true })}
          />
          {errors.kuantitas && (
            <p className="text-xs text-destructive">
              {errors.kuantitas.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="kondisi"
            className="text-xs font-medium text-muted-foreground"
          >
            Kondisi Barang <span className="text-destructive">*</span>
          </label>
          <Controller
            control={control}
            name="kondisi"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                aria-invalid={!!errors.kondisi}
                aria-label="Pilih Kondisi"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kondisi..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem id="BAIK" textValue="BAIK">
                      Kondisi Baik
                    </SelectItem>
                    <SelectItem id="KARATAN" textValue="KARATAN">
                      Kondisi Karatan
                    </SelectItem>
                    <SelectItem id="RUSAK" textValue="RUSAK">
                      Kondisi Rusak
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          ></Controller>
        </div>
      </div>

      {/* Kategori & Lokasi */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="idKategori"
            className="text-xs font-medium text-muted-foreground"
          >
            Kategori <span className="text-destructive">*</span>
          </label>

          <Controller
            control={control}
            name="idKategori"
            render={({ field }) => (
              <Select
                value={field.value || null}
                onChange={field.onChange}
                isInvalid={!!errors.idKategori}
                aria-label="Pilih Kategori"
                placeholder="Pilih Kategori..."
              >
                <SelectTrigger>
                  <SelectValue defaultValue="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem
                        id={category.id}
                        key={category.id}
                        textValue={String(category.id)}
                      >
                        {category.namaKategori}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.idKategori && (
            <p className="text-xs text-destructive">
              {errors.idKategori.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="idLokasi"
            className="text-xs font-medium text-muted-foreground"
          >
            Lokasi Penyimpanan <span className="text-destructive">*</span>
          </label>

          <Controller
            control={control}
            name="idLokasi"
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                aria-invalid={!!errors.idLokasi}
                aria-label="Pilih Lokasi Penyimpanan"
              >
                <SelectTrigger>
                  <SelectValue defaultValue="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {locations.map((location) => (
                      <SelectItem
                        id={Number(location.id)}
                        key={location.id}
                        textValue={String(location.id)}
                      >
                        {location.namaLokasi}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.idLokasi && (
            <p className="text-xs text-destructive">
              {errors.idLokasi.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">Tag</label>
        <Controller
          control={control}
          name="tagIds"
          render={({ field }) => (
            <TagPicker
              tags={tags}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" isDisabled={isPending}>
          {isPending ? "Menyimpan..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}

export const AlatBahanForm = DialogForm;
