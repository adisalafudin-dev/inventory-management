export interface Location {
  id: number;
  namaLokasi: string;
  spesifikLetak: string | null;
}

export interface CreateLocationPayload {
  namaLokasi: string;
  spesifikLetak?: string;
}

/** Meta pagination dari response `GET /location`. */
export interface LocationListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Response `GET /location` (sebelum envelope `TransformInterceptor`). */
export interface LocationListResponse {
  data: Location[];
  meta: LocationListMeta;
}

/** Query params `GET /location` — meniru `QueryLocationDto`. */
export interface LocationQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

export type UpdateLocationPayload = Partial<CreateLocationPayload>;
