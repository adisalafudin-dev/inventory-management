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
  idItem: string;
  idTag: number;
  tag?: Tag; // muncul kalau di-include('tag')
}

export interface ItemTagWithAlatBahan {
  idItem: string;
  idTag: number;
  alatBahan?: { id: string; namaBarang: string }; // muncul kalau di-include('alatBahan')
}
