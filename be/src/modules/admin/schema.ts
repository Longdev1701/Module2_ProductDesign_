import { z } from 'zod';

export const adminCreateOrgSchema = z.object({
  name: z.string().min(3, 'Tên doanh nghiệp tối thiểu 3 ký tự').max(200),
  taxCode: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  legalRepresentative: z.string().optional().nullable(),
  contactEmail: z.string().email('Email liên hệ không hợp lệ').optional().or(z.literal('')).nullable(),
  contactPhone: z.string().optional().nullable(),
  primaryProduct: z.string().min(2, 'Sản phẩm chính tối thiểu 2 ký tự'),
  exportMarkets: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 thị trường xuất khẩu'),
  exportForm: z.string().optional().nullable(),
  exportScale: z.string().optional().nullable(),
});

export const adminUpdateOrgSchema = adminCreateOrgSchema.partial();

export const adminAssignMemberSchema = z.object({
  userId: z.string().uuid('ID người dùng không hợp lệ'),
  role: z.enum(['OWNER', 'MANAGER', 'COMPLIANCE', 'VIEWER']),
});

export const adminChangePlatformRoleSchema = z.object({
  platformRole: z.enum(['SUPER_ADMIN', 'PLATFORM_ADMIN', 'SUPPORT', 'USER']),
});

export const adminQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  role: z.string().optional(),
  market: z.string().optional(),
});

export const adminCiferQuerySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  category: z.string().optional(),
  state: z.string().optional(),
});

export const adminAuditLogQuerySchema = z.object({
  search: z.string().optional(),
  action: z.string().optional(),
  entity: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(25),
});

export type AdminCreateOrgInput = z.infer<typeof adminCreateOrgSchema>;
export type AdminUpdateOrgInput = z.infer<typeof adminUpdateOrgSchema>;
export type AdminAssignMemberInput = z.infer<typeof adminAssignMemberSchema>;
export type AdminChangePlatformRoleInput = z.infer<typeof adminChangePlatformRoleSchema>;
