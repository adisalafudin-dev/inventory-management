import type { Tag } from "../tags/types";

// src/features/alat-bahan/types.ts
export type Kondisi = "BAIK" | "KARATAN" | "RUSAK";
export type TipeMutasi = "IN" | "OUT" | "AUDIT";

export interface AlatBahan {
  id: string;
  namaBarang: string;
  kuantitas: number;
  kondisi: Kondisi;
  updatedAt: string;
  idKategori: number | null;
  idLokasi: number | null;
  idUser: number | null;
  kategori?: { id: number; namaKategori: string } | null; // ada setelah .include('kategori')
  lokasi?: { id: number; namaLokasi: string } | null; // ada setelah .include('lokasi')
  tags?: Tag[];
}

export interface LogMutasi {
  id: string;
  jumlahPerubahan: number;
  tipe: TipeMutasi;
  keterangan: string | null;
  tanggal: string;
  idItem: string;
  alatBahan?: AlatBahan;
}

export interface ListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AlatBahanListResponse {
  data: AlatBahan[];
  meta: ListMeta;
}
export interface LogMutasiListResponse {
  data: LogMutasi[];
  meta: ListMeta;
}
export interface MutasiResult {
  data: AlatBahan;
  mutation: LogMutasi;
}

export interface AlatBahanQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  kondisi?: Kondisi;
}

export interface LogMutasiQueryParams {
  page?: number;
  limit?: number;
  tipe?: "IN" | "OUT";
  startDate?: string;
  endDate?: string;
}

export interface CreateAlatBahanPayload {
  namaBarang: string;
  kuantitas: number;
  kondisi: Kondisi;
  idKategori: string; // string sesuai DTO
  idLokasi: string;
  tags?: Tag[];
}
export type UpdateAlatBahanPayload = Partial<CreateAlatBahanPayload>;

export interface UpdateStokPayload {
  jumlah: number;
  keterangan?: string;
}
