import { z } from 'zod';

export const listAuditLogsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type ListAuditLogsQuery = z.infer<typeof listAuditLogsQuerySchema>;

export const verifyHashInputSchema = z.object({
  hash: z.string().min(8, 'Mã băm tối thiểu 8 ký tự'),
});

export type VerifyHashInput = z.infer<typeof verifyHashInputSchema>;
