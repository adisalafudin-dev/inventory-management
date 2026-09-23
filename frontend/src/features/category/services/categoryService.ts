import api from "@/lib/axios";
import type {
  Category,
  CategoryListResponse,
  CategoryQueryParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types";

export const categoryService = {
  getAll: async (
    params: CategoryQueryParams,
  ): Promise<CategoryListResponse> => {
    const res = await api.get("/category", { params });
    return res.data.data;
  },

  getOne: async (id: string): Promise<Category> => {
    const res = await api.get(`/category/${id}`);
    return res.data.data;
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const res = await api.post("/category", payload);
    return res.data;
  },

  update: async (
    payload: UpdateCategoryPayload,
    id: number,
  ): Promise<Category> => {
    const res = await api.patch(`/category/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/category/${id}`);
  },
};
