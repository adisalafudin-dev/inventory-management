export interface Tag {
  id: number;
  namaTag: string;
}

export interface CreateTagPayload {
  namaTag: string;
}

export type UpdateTagPayload = Partial<CreateTagPayload>;

export interface TagQueryParams {
  search?: string;
}

export interface TagIdsPayload {
  tagIds: number[];
}

export interface TagListResponse {
  data: Tag[];
}

// Untuk endpoint relasi item ↔ tag
export interface ItemTag {
  alatBahanId: string;
  tagId: number;
  tag?: Tag; // muncul kalau di-include('tag')
}

export interface ItemTagWithAlatBahan {
  alatBahanId: string;
  tagId: number;
  alatBahan?: { id: string; namaBarang: string }; // muncul kalau di-include('alatBahan')
}
