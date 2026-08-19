import { BatchStatus } from '@prisma/client';

export interface BatchDto {
  id: string;
  batchCode: string;
  productId: string;
  productName?: string;
  productCategory?: string;
  hsCode?: string | null;
  origin?: string | null;
  quantity: number | null;
  unit: string | null;
  status: BatchStatus;
  producedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  documentsCount?: number;
  checksCount?: number;
}
