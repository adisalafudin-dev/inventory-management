export type MutationType = "IN" | "OUT" | "AUDIT";
export type MutationTypeFilter = "IN" | "OUT";

export interface MutationHistoryItem {
  id: string;
  namaBarang: string;
}

export interface MutationHistory {
  id: string;
  jumlahPerubahan: number;
  tipe: MutationType;
  keterangan: string | null;
  tanggal: string;
  idItem: string;
  alatBahan?: MutationHistoryItem | null;
}

export interface MutationHistoryMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MutationHistoryResponse {
  data: MutationHistory[];
  meta: MutationHistoryMeta;
}

export interface MutationHistoryQueryParams {
  page?: number;
  limit?: number;
  idUser?: number;
  tipe?: MutationTypeFilter;
  startDate?: string;
  endDate?: string;
}
