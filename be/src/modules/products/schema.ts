import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự'),
  category: z.string().default('Sầu riêng tươi'),
  hsCode: z.string().default('0810.60.00'),
  origin: z.string().optional(),
  description: z.string().optional(),
  markets: z.array(z.object({
    marketCode: z.string(),
    marketName: z.string(),
  })).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
