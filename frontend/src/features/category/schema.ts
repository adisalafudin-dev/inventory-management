import { z } from "zod";

export const categorySchema = z.object({
  namaKategori: z
    .string({ error: "Harus Diisi" })
    .min(2, "Nama Kategori Minimal 2 Character"),
  deskripsi: z.string().optional(),
});

export type CategorySchema = z.infer<typeof categorySchema>;

export const categoryDefaultValues: CategorySchema = {
  namaKategori: "",
  deskripsi: "",
};
