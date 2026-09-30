import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tagService } from "../services/tagService";
import type { CreateTagPayload, UpdateTagPayload } from "../types";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: tagService.get,
  });
}

export function useTag(id: number) {
  return useQuery({
    queryKey: ["tags", id],
    queryFn: () => tagService.getOne(id),
    enabled: Boolean(id),
  });
}

// ── CRUD ──
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTagPayload) => tagService.create(payload),
    onSuccess: () => {
      toast.success("Tag berhasil ditambahkan");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menambahkan tag"));
    },
  });
}

export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTagPayload }) =>
      tagService.update(id, payload),
    onSuccess: () => {
      toast.success("Tag berhasil diperbarui");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memperbarui tag"));
    },
  });
}

export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagService.remove(id),
    onSuccess: () => {
      toast.success("Tag berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal menghapus tag"));
    },
  });
}

export function useGetTagsForItem(id: string) {
  return useQuery({
    queryKey: ["item-tags", id],
    queryFn: () => tagService.getTagsForItem(id),
    enabled: Boolean(id),
  });
}

export function useGetItemForTags(id: number) {
  return useQuery({
    queryKey: ["tags-item", id],
    queryFn: () => tagService.getItemsForTag(id),
    enabled: Boolean(id),
  });
}

export function useAttachToItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idItem, idTags }: { idItem: string; idTags: number[] }) =>
      tagService.attachToItem(idItem, idTags),
    onSuccess: () => {
      toast.success("Tag berhasil di pasangkan");
      queryClient.invalidateQueries({ queryKey: ["item-tags"] });
      queryClient.invalidateQueries({ queryKey: ["alat-bahan"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memasangkan tag"));
    },
  });
}

export function useDetachToItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idItem, idTags }: { idItem: string; idTags: number[] }) =>
      tagService.detachFromItem(idItem, idTags),
    onSuccess: () => {
      toast.success("Tag berhasil di pisahkan");
      queryClient.invalidateQueries({ queryKey: ["item-tags"] });
      queryClient.invalidateQueries({ queryKey: ["alat-bahan"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Gagal memisahkan item dengan tag"));
    },
  });
}
