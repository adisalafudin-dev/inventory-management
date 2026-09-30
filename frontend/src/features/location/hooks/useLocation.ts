import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type {
  CreateLocationPayload,
  LocationQueryParams,
  UpdateLocationPayload,
} from "../types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";
import { locationServices } from "../services/locationServices";

export function useLocations(params: LocationQueryParams) {
  // ✅ rename, plural = list
  return useQuery({
    queryKey: ["locations", params],
    queryFn: () => locationServices.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useLocation(id: number) {
  // ✅ rename, singular = satu item
  return useQuery({
    queryKey: ["locations", id],
    queryFn: () => locationServices.getOne(id),
    enabled: Boolean(id), // ✅ tambahan — cegah request jalan kalau id kosong/undefined
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) =>
      locationServices.create(payload),
    onSuccess: () => {
      toast.success("Lokasi berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["locations"] }); // ✅ fix typo
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menambahkan lokasi"));
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateLocationPayload;
    }) => locationServices.update(id, payload),
    onSuccess: () => {
      toast.success("Lokasi berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["locations"] }); // ✅ fix typo
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memperbarui lokasi"));
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => locationServices.delete(id),
    onSuccess: () => {
      toast.success("Lokasi berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["locations"] }); // ✅ fix typo
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menghapus lokasi"));
    },
  });
}
