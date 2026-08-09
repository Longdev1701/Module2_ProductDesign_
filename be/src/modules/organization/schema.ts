import { z } from 'zod';
import { OrganizationRole } from '@prisma/client';

export const createOrganizationSchema = z.object({
  name: z.string().min(3, 'Tên doanh nghiệp tối thiểu 3 ký tự').max(200),
  taxCode: z.string().optional(),
  address: z.string().optional(),
  legalRepresentative: z.string().optional(),
  contactEmail: z.string().email('Email liên hệ không đúng định dạng').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  primaryProduct: z.string().min(1, 'Vui lòng chọn hoặc nhập sản phẩm chiến lược'),
  exportMarkets: z.array(z.string()).min(1, 'Vui lòng chọn ít nhất 1 thị trường xuất khẩu mục tiêu'),
  exportForm: z.string().optional(),
  exportScale: z.string().optional(),
  jobTitle: z.string().min(2, 'Vui lòng nhập chức danh công việc của bạn').optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();

export const inviteMemberSchema = z.object({
  email: z.string().email('Email thành viên không đúng định dạng'),
  role: z.nativeEnum(OrganizationRole).default(OrganizationRole.COMPLIANCE),
});

export const joinOrganizationSchema = z.object({
  token: z.string().min(1, 'Mã lời mời không được để trống'),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type JoinOrganizationInput = z.infer<typeof joinOrganizationSchema>;
