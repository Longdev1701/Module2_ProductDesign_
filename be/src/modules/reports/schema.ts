import { z } from 'zod';

export const createReportSchema = z.object({
  batchId: z.string().min(1, 'Mã lô hàng không được để trống'),
  marketCode: z.string().default('CN'),
  notes: z.string().optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
