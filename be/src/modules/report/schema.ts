import { z } from 'zod';

export const approveReportSchema = z.object({
  notes: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
  containerSealNumber: z.string().max(50, 'Số kẹp chì tối đa 50 ký tự').optional(),
  exportPort: z.string().max(100, 'Cửa khẩu xuất hàng tối đa 100 ký tự').optional(),
});

export type ApproveReportInput = z.infer<typeof approveReportSchema>;
