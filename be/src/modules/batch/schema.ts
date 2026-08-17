import { z } from 'zod';
import { BatchStatus } from '@prisma/client';

export const batchStatusSchema = z.nativeEnum(BatchStatus);

export const createBatchSchema = z.object({
  batchCode: z
    .string()
    .min(3, 'Mã Lô hàng tối thiểu 3 ký tự')
    .max(50, 'Mã Lô hàng tối đa 50 ký tự')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Mã Lô hàng chỉ chứa chữ cái, số, gạch nối (-) hoặc gạch dưới (_)'),
  productId: z.string().uuid('ID sản phẩm không hợp lệ'),
  quantity: z.coerce.number().positive('Số lượng xuất khẩu phải lớn hơn 0').optional().nullable(),
  unit: z.string().max(20, 'Đơn vị tính tối đa 20 ký tự').default('tấn'),
  status: batchStatusSchema.optional().default(BatchStatus.DRAFT),
  producedAt: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export const updateBatchSchema = z.object({
  batchCode: z
    .string()
    .min(3, 'Mã Lô hàng tối thiểu 3 ký tự')
    .max(50, 'Mã Lô hàng tối đa 50 ký tự')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Mã Lô hàng chỉ chứa chữ cái, số, gạch nối (-) hoặc gạch dưới (_)')
    .optional(),
  productId: z.string().uuid('ID sản phẩm không hợp lệ').optional(),
  quantity: z.coerce.number().positive('Số lượng xuất khẩu phải lớn hơn 0').optional().nullable(),
  unit: z.string().max(20, 'Đơn vị tính tối đa 20 ký tự').optional().nullable(),
  status: batchStatusSchema.optional(),
  producedAt: z.coerce.date().optional().nullable(),
  expiresAt: z.coerce.date().optional().nullable(),
});

export const listBatchesQuerySchema = z.object({
  search: z.string().optional(),
  productId: z.string().uuid().optional(),
  status: batchStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(['createdAt:desc', 'createdAt:asc', 'batchCode:asc', 'batchCode:desc']).default('createdAt:desc'),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
export type ListBatchesQuery = z.infer<typeof listBatchesQuerySchema>;
