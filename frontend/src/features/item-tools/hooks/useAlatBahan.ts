import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";
import type {
  AlatBahanQueryParams,
  CreateAlatBahanPayload,
  UpdateAlatBahanPayload,
  UpdateStokPayload,
} from "../types";
import { itemToolService } from "../services/itemToolService";

export function useAlatBahanList(params: AlatBahanQueryParams) {
  return useQuery({
    queryKey: ["alat-bahan", params],
    queryFn: () => itemToolService.getAll(params),
    placeholderData: keepPreviousData,
  });
}

export function useAlatBahan(id: string) {
  return useQuery({
    queryKey: ["alat-bahan", id],
    queryFn: () => itemToolService.getOne(id),
    enabled: Boolean(id),
  });
}

function invalidateAfterMutasi(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["alat-bahan"] });
  queryClient.invalidateQueries({ queryKey: ["log-mutasi"] });
  queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
}

export function useCreateAlatBahan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAlatBahanPayload) =>
      itemToolService.create(payload),
    onSuccess: () => {
      toast.success("Item berhasil ditambahkan");
      invalidateAfterMutasi(queryClient);
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Gagal menambahkan item")),
  });
}

export function useUpdateAlatBahan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAlatBahanPayload;
    }) => itemToolService.update(id, payload),
    onSuccess: () => {
      toast.success("Item berhasil diperbarui");
      invalidateAfterMutasi(queryClient);
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Gagal memperbarui item")),
  });
}

export function useDeleteAlatBahan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => itemToolService.remove(id),
    onSuccess: () => {
      toast.success("Item berhasil dihapus");
      invalidateAfterMutasi(queryClient);
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Gagal menghapus item")),
  });
}

export function useIncreaseStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStokPayload }) =>
      itemToolService.increaseStock(id, payload),
    onSuccess: () => {
      toast.success("Stok item berhasil ditambahkan");
      invalidateAfterMutasi(queryClient);
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Gagal menambahkan stok item")),
  });
}

export function useDecreaseStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStokPayload }) =>
      itemToolService.decreaseStock(id, payload),
    onSuccess: () => {
      toast.success("Stok berhasil dikurangi");
      invalidateAfterMutasi(queryClient);
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Gagal mengurangi stok")),
  });
}

export function useLogMutasiGlobal(params: AlatBahanQueryParams) {
  return useQuery({
    queryKey: ["log-mutasi", params],
    queryFn: () => itemToolService.getLogMutasiGlobal(params),
    placeholderData: keepPreviousData,
  });
}

export function useLogMutasiItem(itemId: string, params: AlatBahanQueryParams) {
  return useQuery({
    queryKey: ["log-mutasi", itemId, params],
    queryFn: () => itemToolService.getLogMutasiPerBarang(itemId, params),
    enabled: Boolean(itemId),
    placeholderData: keepPreviousData,
  });
}

export function useExportCsv() {
  return useMutation({
    mutationFn: () => itemToolService.exportCsv(),
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laporan_inventaris_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan CSV berhasil diunduh");
    },
    onError: (error) =>
      toast.error(getErrorMessage(error, "Gagal mengunduh laporan")),
  });
}
