// src/features/category/hooks/useCategories.ts
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import type {
  CategoryQueryParams,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

export function useCategories(params: CategoryQueryParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryService.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) =>
      categoryService.create(payload),
    onSuccess: () => {
      toast.success("Kategori berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menambahkan kategori"));
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateCategoryPayload;
    }) => categoryService.update(payload, id),
    onSuccess: () => {
      toast.success("Kategori berhasil di update");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal update kategori"));
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: () => {
      toast.success("Kategori berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menghapus kategori"));
    },
  });
}
