import { z } from "zod";

export const tagSchema = z.object({
  namaTag: z
    .string({
      error: "Nama tag harus berupa teks",
    })
    .trim()
    .min(1, "Nama tag tidak boleh kosong")
    .max(50, "Nama tag maksimal 50 karakter"),
});

export type TagSchema = z.infer<typeof tagSchema>;

export const tagDefaultValues: TagSchema = {
  namaTag: "",
};
