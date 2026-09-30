import { z } from "zod";

export const locationSchema = z.object({
  namaLokasi: z
    .string({
      error: "Nama Lokasi harus berupa teks",
    })
    .trim()
    .min(2, "Nama Lokasi minimal 2 karakter"),
  spesifikLetak: z
    .string()
    .trim()
    .max(100, "Spesifik Letak maksimal 100 karakter")
    .optional()
    .or(z.literal("")),
});

export type LocationSchema = z.infer<typeof locationSchema>;

export const locationDefaultValues: LocationSchema = {
  namaLokasi: "",
  spesifikLetak: "",
};
