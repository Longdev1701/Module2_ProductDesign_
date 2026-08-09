import { z } from 'zod';

export const adminCreateOrgSchema = z.object({
  name: z.string().min(3, 'Tên doanh nghiệp tối thiểu 3 ký tự').max(200),
  taxCode: z.string().optional(),
  address: z.string().optional(),
  legalRepresentative: z.string().optional(),
  contactEmail: z.string().email('Email liên hệ không hợp lệ').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  primaryProduct: z.string().min(2, 'Sản phẩm chính tối thiểu 2 ký tự'),
  exportMarkets: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 thị trường xuất khẩu'),
});

export const adminAssignMemberSchema = z.object({
  userId: z.string().uuid('ID người dùng không hợp lệ'),
  role: z.enum(['OWNER', 'MANAGER', 'COMPLIANCE', 'VIEWER']),
});

export type AdminCreateOrgInput = z.infer<typeof adminCreateOrgSchema>;
export type AdminAssignMemberInput = z.infer<typeof adminAssignMemberSchema>;
