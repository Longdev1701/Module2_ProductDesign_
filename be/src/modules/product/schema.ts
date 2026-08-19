import { z } from 'zod';

export const productMarketRequirementInputSchema = z.object({
  marketCode: z.string().min(1, 'Mã thị trường không được để trống'),
  marketName: z.string().min(1, 'Tên thị trường không được để trống'),
});

export const createProductSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự').max(200, 'Tên sản phẩm tối đa 200 ký tự'),
  category: z.string().min(2, 'Danh mục sản phẩm không được để trống'),
  hsCode: z.string().regex(/^\d{4}(\.\d{2}(\.\d{2})?)?$/, 'Mã HS không hợp lệ (VD: 0810.60.00 hoặc 08106000)').optional().nullable().or(z.literal('')),
  description: z.string().max(2000, 'Mô tả tối đa 2000 ký tự').optional().nullable(),
  origin: z.string().max(200, 'Vùng trồng/Xuất xứ tối đa 200 ký tự').optional().nullable(),
  markets: z.array(productMarketRequirementInputSchema).optional().default([]),
});

export const updateProductSchema = z.object({
  name: z.string().min(2, 'Tên sản phẩm tối thiểu 2 ký tự').max(200, 'Tên sản phẩm tối đa 200 ký tự').optional(),
  category: z.string().min(2, 'Danh mục sản phẩm không được để trống').optional(),
  hsCode: z.string().regex(/^\d{4}(\.\d{2}(\.\d{2})?)?$/, 'Mã HS không hợp lệ (VD: 0810.60.00 hoặc 08106000)').optional().nullable().or(z.literal('')),
  description: z.string().max(2000, 'Mô tả tối đa 2000 ký tự').optional().nullable(),
  origin: z.string().max(200, 'Vùng trồng/Xuất xứ tối đa 200 ký tự').optional().nullable(),
  markets: z.array(productMarketRequirementInputSchema).optional(),
});

export const listProductsQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  sort: z.enum(['createdAt:desc', 'createdAt:asc', 'name:asc', 'name:desc']).default('createdAt:desc'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
