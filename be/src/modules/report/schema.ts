import { z } from 'zod';

export const approveReportSchema = z.object({
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
  containerSealNumber: z.string().max(50, 'Số kẹp chì tối đa 50 ký tự').optional(),
  exportPort: z.string().max(100, 'Cửa khẩu xuất hàng tối đa 100 ký tự').optional(),
});

export type ApproveReportInput = z.infer<typeof approveReportSchema>;

export const listHistorySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  productId: z.string().optional(),
  market: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
});

export type ListHistoryQuery = z.infer<typeof listHistorySchema>;

