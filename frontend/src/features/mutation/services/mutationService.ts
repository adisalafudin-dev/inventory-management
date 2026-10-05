import api from "@/lib/axios";
import type {
  MutationHistoryQueryParams,
  MutationHistoryResponse,
} from "../types";

export const mutationService = {
  getHistory: async (
    params: MutationHistoryQueryParams,
  ): Promise<MutationHistoryResponse> => {
    const response = await api.get("/alat-bahan/log-mutasi", { params });
    return response.data.data;
  },

  getItemHistory: async (
    itemId: string,
    params: MutationHistoryQueryParams,
  ): Promise<MutationHistoryResponse> => {
    const response = await api.get(`/alat-bahan/${itemId}/log`, { params });
    return response.data.data;
  },
};
