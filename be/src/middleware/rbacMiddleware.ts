import { Request, Response, NextFunction } from 'express';
import { OrganizationRole, PlatformRole } from '@prisma/client';

export type TenantPermission =
  | 'org.manage'
  | 'member.invite'
  | 'member.role_change'
  | 'shipment.create'
  | 'shipment.delete'
  | 'document.upload'
  | 'check.run'
  | 'finding.resolve'
  | 'report.draft'
  | 'report.approve'
  | 'report.view'
  | 'auditlog.view'
  | 'dashboard.view';

const TENANT_PERMISSION_MATRIX: Record<TenantPermission, OrganizationRole[]> = {
  'org.manage': [OrganizationRole.OWNER],
  'member.invite': [OrganizationRole.OWNER, OrganizationRole.MANAGER],
  'member.role_change': [OrganizationRole.OWNER],
  'shipment.create': [OrganizationRole.OWNER, OrganizationRole.MANAGER, OrganizationRole.COMPLIANCE],
  'shipment.delete': [OrganizationRole.OWNER, OrganizationRole.MANAGER],
  'document.upload': [OrganizationRole.OWNER, OrganizationRole.MANAGER, OrganizationRole.COMPLIANCE],
  'check.run': [OrganizationRole.OWNER, OrganizationRole.MANAGER, OrganizationRole.COMPLIANCE],
  'finding.resolve': [OrganizationRole.OWNER, OrganizationRole.MANAGER, OrganizationRole.COMPLIANCE],
  'report.draft': [OrganizationRole.OWNER, OrganizationRole.MANAGER, OrganizationRole.COMPLIANCE],
  'report.approve': [OrganizationRole.OWNER, OrganizationRole.MANAGER],
  'report.view': [OrganizationRole.OWNER, OrganizationRole.MANAGER, OrganizationRole.COMPLIANCE, OrganizationRole.VIEWER],
  'auditlog.view': [OrganizationRole.OWNER, OrganizationRole.MANAGER],
  'dashboard.view': [OrganizationRole.OWNER, OrganizationRole.MANAGER, OrganizationRole.COMPLIANCE, OrganizationRole.VIEWER],
};

/**
 * Middleware kiểm tra Phân quyền Tầng Doanh nghiệp (Tenant Level Authorization)
 */
export function rbacMiddleware(requiredPermission: TenantPermission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.orgMember) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Yêu cầu ngữ cảnh thành viên doanh nghiệp',
          requestId: req.requestId ?? '',
        },
      });
    }

    const allowedRoles = TENANT_PERMISSION_MATRIX[requiredPermission] || [];
    if (!allowedRoles.includes(req.orgMember.role)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Từ chối truy cập: Thao tác '${requiredPermission}' yêu cầu vai trò [${allowedRoles.join(', ')}]`,
          requestId: req.requestId ?? '',
        },
      });
    }

    return next();
  };
}

/**
 * Middleware kiểm tra Phân quyền Tầng Nền tảng / Hệ thống (Platform Level Authorization)
 */
export function platformRbacMiddleware(allowedPlatformRoles: PlatformRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.platformRole) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Yêu cầu quyền truy cập nền tảng',
          requestId: req.requestId ?? '',
        },
      });
    }

    if (!allowedPlatformRoles.includes(req.user.platformRole)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Từ chối truy cập Nền tảng: Yêu cầu vai trò [${allowedPlatformRoles.join(', ')}]`,
          requestId: req.requestId ?? '',
        },
      });
    }

    return next();
  };
}
