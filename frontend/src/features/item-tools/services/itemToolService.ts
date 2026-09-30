import api from "@/lib/axios";
import type {
  AlatBahan,
  AlatBahanListResponse,
  AlatBahanQueryParams,
  CreateAlatBahanPayload,
  LogMutasiQueryParams,
  MutasiResult,
  UpdateAlatBahanPayload,
  UpdateStokPayload,
  LogMutasiListResponse,
} from "../types";

export const itemToolService = {
  getAll: async (
    params: AlatBahanQueryParams,
  ): Promise<AlatBahanListResponse> => {
    const res = await api.get("/alat-bahan", { params });
    return res.data.data;
  },

  getOne: async (id: string): Promise<AlatBahan> => {
    const res = await api.get(`/alat-bahan/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateAlatBahanPayload): Promise<MutasiResult> => {
    const res = await api.post("/alat-bahan", payload);
    return res.data.data;
  },

  update: async (
    id: string,
    payload: UpdateAlatBahanPayload,
  ): Promise<MutasiResult> => {
    const res = await api.patch(`/alat-bahan/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: string): Promise<{ message: string }> => {
    const res = await api.delete(`/alat-bahan/${id}`);
    return res.data.data;
  },

  increaseStock: async (
    id: string,
    payload: UpdateStokPayload,
  ): Promise<MutasiResult> => {
    const res = await api.patch(`/alat-bahan/${id}/increase`, payload);
    return res.data.data;
  },

  decreaseStock: async (
    id: string,
    payload: UpdateStokPayload,
  ): Promise<MutasiResult> => {
    const res = await api.patch(`/alat-bahan/${id}/decrease`, payload);
    return res.data.data;
  },

  getLogMutasiGlobal: async (
    params: LogMutasiQueryParams,
  ): Promise<LogMutasiListResponse> => {
    const res = await api.get("/alat-bahan/log-mutasi", { params });
    return res.data.data;
  },

  getLogMutasiPerBarang: async (
    idItem: string,
    params: LogMutasiQueryParams,
  ): Promise<LogMutasiListResponse> => {
    const res = await api.get(`/alat-bahan/${idItem}/log`, { params });
    return res.data.data;
  },

  exportCsv: async (): Promise<Blob> => {
    const res = await api.get("/alat-bahan/export", { responseType: "blob" });
    return res.data;
  },
};
