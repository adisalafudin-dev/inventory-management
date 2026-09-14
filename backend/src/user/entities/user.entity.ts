import { AlatBahan } from '../../alat-bahan/entities/alat-bahan.entity.js';
import { Category } from '../../category/entities/category.entity.js';
import { Location } from '../../location/entities/location.entity.js';

export class User {
  id!: number;
  email!: string;
  username!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;
  alatBahan!: AlatBahan[];
  kategori!: Category[];
  lokasiPenyimpanan!: Location[];
}
