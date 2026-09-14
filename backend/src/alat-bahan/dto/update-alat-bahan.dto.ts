import { PartialType } from '@nestjs/mapped-types';
import { CreateAlatBahanDto } from './create-alat-bahan.dto.js';

export class UpdateAlatBahanDto extends PartialType(CreateAlatBahanDto) {}
