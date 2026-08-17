import { z } from 'zod';

export const createBatchSchema = z.object({
  batchCode: z.string().min(2, 'Mã lô hàng tối thiểu 2 ký tự'),
  productId: z.string().min(1, 'Sản phẩm không được để trống'),
  quantity: z.number().positive('Khối lượng phải lớn hơn 0'),
  unit: z.string().default('tấn'),
  harvestDate: z.string().optional(),
  packagingDate: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.string().default('COLLECTING_DOCUMENTS'),
});

export const updateBatchSchema = createBatchSchema.partial();

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
export type UpdateBatchInput = z.infer<typeof updateBatchSchema>;
