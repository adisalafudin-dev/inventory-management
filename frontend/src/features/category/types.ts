export interface Category {
  id: number;
  namaKategori: string;
  deskripsi: string | null;
  idUser: number;
}

export interface CreateCategoryPayload {
  namaKategori: string;
  deskripsi?: string;
}

export type UpdateCategoryPayload = Partial<CreateCategoryPayload>;
export interface CategoryListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryListResponse {
  data: Category[];
  meta: CategoryListMeta;
}

export interface CategoryQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}
