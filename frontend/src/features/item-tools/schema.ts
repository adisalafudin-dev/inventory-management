// src/features/alat-bahan/schema.ts
import { z } from "zod";

export const alatBahanSchema = z.object({
  namaBarang: z.string().min(1, "Nama barang wajib diisi"),
  kuantitas: z.number().int().min(0, "Kuantitas tidak boleh negatif"),
  kondisi: z.enum(["BAIK", "KARATAN", "RUSAK"]),
  idKategori: z.string().min(1, "Pilih kategori"),
  idLokasi: z.string().min(1, "Pilih lokasi"),
});
export type AlatBahanSchema = z.infer<typeof alatBahanSchema>;

export const stokSchema = z.object({
  jumlah: z.number().int().min(1, "Jumlah minimal 1"),
  keterangan: z.string().optional(),
});
export type StokSchema = z.infer<typeof stokSchema>;
