import { z } from 'zod';

export const documentTypeSchema = z.enum([
  'CO',
  'CQ',
  'PHYTO',
  'LAB_REPORT',
  'CONTRACT',
  'INVOICE',
  'PACKING_LIST',
  'GPS_MAP',
  'OTHER',
]);

export const uploadDocumentSchema = z.object({
  title: z.string().min(2, 'Tiêu đề chứng từ tối thiểu 2 ký tự').max(200, 'Tiêu đề tối đa 200 ký tự'),
  type: documentTypeSchema,
  fileUrl: z.string().min(1, 'Đường dẫn tệp tin không được để trống'),
  fileSize: z.number().int().positive().max(15 * 1024 * 1024, 'Kích thước tệp tối đa 15MB').optional(),
  mimeType: z.string().max(100).optional(),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  type: documentTypeSchema.optional(),
});

export const listDocumentsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  type: documentTypeSchema.optional(),
  batchId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
});
