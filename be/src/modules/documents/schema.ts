import { z } from 'zod';

export const createDocumentSchema = z.object({
  batchId: z.string().min(1, 'Mã lô hàng không được để trống'),
  type: z.string().min(1, 'Loại chứng từ không được để trống'),
  fileName: z.string().min(1, 'Tên tệp tin không được để trống'),
  fileUrl: z.string().url('Đường dẫn tệp tin phải là URL hợp lệ').optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  extractedData: z.record(z.any()).optional(),
  expiresAt: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
