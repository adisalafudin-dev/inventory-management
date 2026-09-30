import api from "@/lib/axios";
import type {
  Tag,
  CreateTagPayload,
  UpdateTagPayload,
  ItemTag,
  ItemTagWithAlatBahan,
} from "../types";

export const tagService = {
  create: async (payload: CreateTagPayload): Promise<Tag> => {
    const res = await api.post("/tag", payload);
    return res.data.data;
  },

  get: async () => {
    const res = await api.get("/tag");
    return res.data.data;
  },

  getOne: async (id: number): Promise<Tag> => {
    const res = await api.get(`/tag/${id}`);
    return res.data.data;
  },

  update: async (id: number, payload: UpdateTagPayload): Promise<Tag> => {
    const res = await api.patch(`/tag/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<{ message: string }> => {
    const res = await api.delete(`/tag/${id}`);
    return res.data.data;
  },

  // ── Relasi Tag ↔ AlatBahan ──
  getTagsForItem: async (itemId: string): Promise<ItemTag[]> => {
    const res = await api.get(`/tag/item/${itemId}`);
    return res.data.data;
  },

  getItemsForTag: async (id: number): Promise<ItemTagWithAlatBahan[]> => {
    const res = await api.get(`/tag/${id}/items`);
    return res.data.data;
  },

  attachToItem: async (itemId: string, idTags: number[]): Promise<void> => {
    await api.post(`/tag/items/${itemId}`, { idTags });
  },

  detachFromItem: async (itemId: string, idTags: number[]): Promise<void> => {
    await api.delete(`/tag/items/${itemId}`, { data: { idTags } });
  },
};
