import api from "@/lib/axios";
import type {
  CreateLocationPayload,
  LocationListResponse,
  Location,
  UpdateLocationPayload,
  LocationQueryParams,
} from "../types";

export const locationServices = {
  getAll: async (
    params: LocationQueryParams,
  ): Promise<LocationListResponse> => {
    const res = await api.get("/location", { params });
    return res.data.data;
  },

  create: async (payload: CreateLocationPayload): Promise<Location> => {
    const data = await api.post("/location", payload);
    return data.data.data;
  },

  getOne: async (id: number): Promise<Location> => {
    const res = await api.get(`/location/${id}`); // ✅ tambah leading slash, lihat poin 3
    return res.data.data;
  },

  update: async (
    id: number,
    payload: UpdateLocationPayload,
  ): Promise<Location> => {
    const data = await api.patch(`/location/${id}`, payload);
    return data.data.data;
  },

  delete: async (id: number): Promise<{ message: string }> => {
    const res = await api.delete(`/location/${id}`);
    return res.data.data;
  },
};
