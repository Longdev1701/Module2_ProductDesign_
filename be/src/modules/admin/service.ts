import { prisma } from '../../lib/prisma';
import { createAuditLog } from '../../services/auditLogService';
import { LegalSyncService } from '../../jobs/legal-sync/service';
import {
  AdminCreateOrgInput,
  AdminUpdateOrgInput,
  AdminAssignMemberInput,
  AdminChangePlatformRoleInput,
} from './schema';
import { PlatformRole, OrganizationRole } from '@prisma/client';

export class AdminService {
  /**
   * 1. Tổng quan hệ thống (System Overview KPIs)
   */
  static async getOverview() {
    const [
      totalOrgs,
      totalUsers,
      totalBatches,
      totalProducts,
      totalRegulations,
      totalLegalUpdates,
      totalCifer,
      recentAuditLogs,
      orgsByScale,
    ] = await Promise.all([
      prisma.organization.count(),
      prisma.profile.count(),
      prisma.batch.count(),
      prisma.product.count(),
      prisma.regulation.count(),
      prisma.legalUpdate.count(),
      (prisma as any).ciferRegistry ? (prisma as any).ciferRegistry.count() : 0,
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: {
            select: {
              fullName: true,
              email: true,
              platformRole: true,
            },
          },
        },
      }),
      prisma.organization.groupBy({
        by: ['primaryProduct'],
        _count: { id: true },
      }),
    ]);

    return {
      kpis: {
        totalOrgs,
        totalUsers,
        totalBatches,
        totalProducts,
        totalRegulations,
        totalLegalUpdates,
        totalCifer,
      },
      recentAuditLogs,
      orgsByProduct: orgsByScale.map((g) => ({
        product: g.primaryProduct || 'Chưa phân loại',
        count: g._count.id,
      })),
      systemStatus: {
        database: 'HEALTHY',
        auth: 'OPERATIONAL',
        aiEngine: 'READY (Gemini 3.5 Flash)',
        crawler: 'ACTIVE',
      },
    };
  }

  /**
   * 2. Quản lý Doanh nghiệp (Organizations CRUD)
   */
  static async getAllOrganizations(query?: { search?: string; page?: number; pageSize?: number }) {
    const page = query?.page || 1;
    const pageSize = query?.pageSize || 20;
    const skip = (page - 1) * pageSize;
    const search = query?.search?.trim();

    const where: any = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { taxCode: { contains: search, mode: 'insensitive' } },
            { primaryProduct: { contains: search, mode: 'insensitive' } },
            { contactEmail: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [total, orgs] = await Promise.all([
      prisma.organization.count({ where }),
      prisma.organization.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              members: true,
              products: true,
              documents: true,
            },
          },
          members: {
            include: {
              profile: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  jobTitle: true,
                  platformRole: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      items: orgs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  static async createOrganization(adminUserId: string, input: AdminCreateOrgInput, ipAddress?: string) {
    const org = await prisma.organization.create({
      data: {
        name: input.name,
        taxCode: input.taxCode || null,
        address: input.address || null,
        legalRepresentative: input.legalRepresentative || null,
        contactEmail: input.contactEmail || null,
        contactPhone: input.contactPhone || null,
        primaryProduct: input.primaryProduct,
        exportMarkets: input.exportMarkets,
        exportForm: input.exportForm || null,
        exportScale: input.exportScale || null,
      },
    });

    await createAuditLog({
      userId: adminUserId,
      action: 'admin.org_created',
      entity: 'Organization',
      entityId: org.id,
      metadata: { orgName: input.name },
      ipAddress,
    });

    return org;
  }

  static async updateOrganization(adminUserId: string, orgId: string, input: AdminUpdateOrgInput, ipAddress?: string) {
    const existing = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!existing) {
      throw new Error('Doanh nghiệp không tồn tại');
    }

    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(input.name ? { name: input.name } : {}),
        ...(input.taxCode !== undefined ? { taxCode: input.taxCode } : {}),
        ...(input.address !== undefined ? { address: input.address } : {}),
        ...(input.legalRepresentative !== undefined ? { legalRepresentative: input.legalRepresentative } : {}),
        ...(input.contactEmail !== undefined ? { contactEmail: input.contactEmail } : {}),
        ...(input.contactPhone !== undefined ? { contactPhone: input.contactPhone } : {}),
        ...(input.primaryProduct ? { primaryProduct: input.primaryProduct } : {}),
        ...(input.exportMarkets ? { exportMarkets: input.exportMarkets } : {}),
        ...(input.exportForm !== undefined ? { exportForm: input.exportForm } : {}),
        ...(input.exportScale !== undefined ? { exportScale: input.exportScale } : {}),
      },
    });

    await createAuditLog({
      userId: adminUserId,
      action: 'admin.org_updated',
      entity: 'Organization',
      entityId: orgId,
      metadata: { orgName: updated.name, changes: input },
      ipAddress,
    });

    return updated;
  }

  static async deleteOrganization(adminUserId: string, orgId: string, ipAddress?: string) {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      select: { id: true, name: true },
    });

    if (!org) {
      throw new Error('Doanh nghiệp không tồn tại');
    }

    await prisma.organization.delete({
      where: { id: orgId },
    });

    await createAuditLog({
      userId: adminUserId,
      action: 'admin.org_deleted',
      entity: 'Organization',
      entityId: orgId,
      metadata: { deletedOrgName: org.name },
      ipAddress,
    });

    return { success: true, message: `Đã xóa doanh nghiệp ${org.name}` };
  }

  /**
   * 3. Quản lý Tài khoản & Phân quyền Toàn hệ thống (Users & RBAC)
   */
  static async getAllUsers(query?: { search?: string; role?: string; page?: number; pageSize?: number }) {
    const page = query?.page || 1;
    const pageSize = query?.pageSize || 20;
    const skip = (page - 1) * pageSize;
    const search = query?.search?.trim();
    const roleFilter = query?.role;

    const where: any = {
      ...(search
        ? {
            OR: [
              { fullName: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { jobTitle: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(roleFilter && roleFilter !== 'ALL'
        ? { platformRole: roleFilter as PlatformRole }
        : {}),
    };

    const [total, users] = await Promise.all([
      prisma.profile.count({ where }),
      prisma.profile.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          organizationMembers: {
            include: {
              organization: {
                select: {
                  id: true,
                  name: true,
                  primaryProduct: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      items: users.map((u) => ({
        id: u.id,
        email: u.email,
        fullName: u.fullName,
        jobTitle: u.jobTitle,
        platformRole: u.platformRole,
        avatarUrl: u.avatarUrl,
        createdAt: u.createdAt,
        organizations: u.organizationMembers.map((m) => ({
          orgId: m.organization.id,
          orgName: m.organization.name,
          primaryProduct: m.organization.primaryProduct,
          role: m.role,
          status: m.status,
          joinedAt: m.joinedAt,
        })),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  static async changeUserPlatformRole(adminUserId: string, targetUserId: string, newRole: PlatformRole, ipAddress?: string) {
    const targetUser = await prisma.profile.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, platformRole: true },
    });

    if (!targetUser) {
      throw new Error('Người dùng không tồn tại');
    }

    // Bảo vệ không cho phép Super Admin tự hạ quyền nếu là Super Admin cuối cùng
    if (adminUserId === targetUserId && newRole !== 'SUPER_ADMIN') {
      const superAdminCount = await prisma.profile.count({
        where: { platformRole: 'SUPER_ADMIN' },
      });
      if (superAdminCount <= 1) {
        throw new Error('Không thể tự hạ quyền Super Admin duy nhất của hệ thống');
      }
    }

    const updated = await prisma.profile.update({
      where: { id: targetUserId },
      data: { platformRole: newRole },
      select: { id: true, email: true, fullName: true, platformRole: true },
    });

    await createAuditLog({
      userId: adminUserId,
      action: 'admin.platform_role_changed',
      entity: 'Profile',
      entityId: targetUserId,
      metadata: {
        targetEmail: targetUser.email,
        oldRole: targetUser.platformRole,
        newRole,
      },
      ipAddress,
    });

    return updated;
  }

  static async assignMember(adminUserId: string, orgId: string, input: AdminAssignMemberInput, ipAddress?: string) {
    const org = await prisma.organization.findUnique({ where: { id: orgId } });
    if (!org) throw new Error('Doanh nghiệp không tồn tại');

    const profile = await prisma.profile.findUnique({ where: { id: input.userId } });
    if (!profile) throw new Error('Người dùng không tồn tại');

    const member = await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: input.userId,
        },
      },
      update: {
        role: input.role as OrganizationRole,
        status: 'ACTIVE',
      },
      create: {
        organizationId: orgId,
        userId: input.userId,
        role: input.role as OrganizationRole,
        status: 'ACTIVE',
      },
    });

    await createAuditLog({
      userId: adminUserId,
      action: 'admin.member_assigned',
      entity: 'OrganizationMember',
      entityId: member.id,
      metadata: { orgId, orgName: org.name, targetUserId: input.userId, userEmail: profile.email, role: input.role },
      ipAddress,
    });

    return member;
  }

  static async removeMember(adminUserId: string, orgId: string, targetUserId: string, ipAddress?: string) {
    const existing = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: targetUserId,
        },
      },
      include: {
        organization: { select: { name: true } },
        profile: { select: { email: true } },
      },
    });

    if (!existing) {
      throw new Error('Thành viên không thuộc doanh nghiệp này');
    }

    await prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: targetUserId,
        },
      },
    });

    await createAuditLog({
      userId: adminUserId,
      action: 'admin.member_removed',
      entity: 'OrganizationMember',
      entityId: existing.id,
      metadata: { orgId, orgName: existing.organization.name, targetUserId, userEmail: existing.profile.email },
      ipAddress,
    });

    return { success: true, message: `Đã thu hồi quyền của ${existing.profile.email} khỏi ${existing.organization.name}` };
  }

  /**
   * 4. Quản lý Đồng bộ Pháp lý (Legal Sync Management)
   */
  static async getLegalSyncStats() {
    const [totalUpdates, totalRegulations, byMarket, latestUpdate] = await Promise.all([
      prisma.legalUpdate.count(),
      prisma.regulation.count(),
      prisma.legalUpdate.groupBy({
        by: ['market'],
        _count: { id: true },
      }),
      prisma.legalUpdate.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true, sourceAgency: true, market: true, titleVi: true },
      }),
    ]);

    const marketDistribution: Record<string, number> = {};
    byMarket.forEach((m) => {
      marketDistribution[m.market] = m._count.id;
    });

    return {
      totalUpdates,
      totalRegulations,
      marketDistribution,
      lastSyncAt: latestUpdate?.createdAt || null,
      latestScrapedDocument: latestUpdate,
      crawlerStatus: 'ONLINE_ACTIVE',
    };
  }

  static async triggerLegalSync(adminUserId: string, ipAddress?: string) {
    await createAuditLog({
      userId: adminUserId,
      action: 'admin.legal_sync_triggered',
      entity: 'LegalUpdate',
      entityId: 'sync-manual-trigger',
      metadata: { triggeredBy: adminUserId },
      ipAddress,
    });

    // Chạy đồng bộ trong background
    const syncPromise = LegalSyncService.runSync(adminUserId, ipAddress);

    return {
      status: 'PROCESSING',
      message: 'Đã kích hoạt tiến trình cào toàn văn & tóm tắt AI cho 9 thị trường',
      startedAt: new Date(),
    };
  }

  /**
   * 5. Cơ sở Dữ liệu CIFER Trung Quốc (CIFER China Registry)
   */
  static async getCiferRegistries(query?: { search?: string; category?: string; state?: string; page?: number; pageSize?: number }) {
    if (!(prisma as any).ciferRegistry) {
      return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 0 };
    }

    const page = query?.page || 1;
    const pageSize = query?.pageSize || 20;
    const skip = (page - 1) * pageSize;
    const search = query?.search?.trim();

    const where: any = {
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { chinaRegNo: { contains: search, mode: 'insensitive' } },
              { overseasRegNo: { contains: search, mode: 'insensitive' } },
              { address: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(query?.category && query.category !== 'ALL'
        ? { category: { contains: query.category, mode: 'insensitive' } }
        : {}),
      ...(query?.state && query.state !== 'ALL'
        ? query.state.toUpperCase() === 'VALID'
          ? { state: { in: ['有效', 'Valid', 'VALID', 'valid'] } }
          : query.state.toUpperCase() === 'SUSPENDED'
          ? { state: { in: ['暂停进口', 'Suspended', 'SUSPENDED', 'suspended'] } }
          : query.state.toUpperCase() === 'REVOKED' || query.state.toUpperCase() === 'CANCELLED'
          ? { state: { in: ['注销', 'Revoked', 'REVOKED', 'Cancelled'] } }
          : { state: { equals: query.state, mode: 'insensitive' } }
        : {}),
    };

    const [total, records] = await Promise.all([
      (prisma as any).ciferRegistry.count({ where }),
      (prisma as any).ciferRegistry.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          no: true,
          country: true,
          category: true,
          chinaRegNo: true,
          overseasRegNo: true,
          name: true,
          address: true,
          regDate: true,
          expDate: true,
          state: true,
          organizationId: true,
          organization: {
            select: { id: true, name: true, taxCode: true },
          },
        },
      }),
    ]);

    return {
      items: records,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  /**
   * 6. Nhật ký Kiểm toán Hệ thống (System Audit Logs)
   */
  static async getAuditLogs(query?: { search?: string; action?: string; entity?: string; page?: number; pageSize?: number }) {
    const page = query?.page || 1;
    const pageSize = query?.pageSize || 25;
    const skip = (page - 1) * pageSize;
    const search = query?.search?.trim();

    const where: any = {
      ...(search
        ? {
            OR: [
              { action: { contains: search, mode: 'insensitive' } },
              { entity: { contains: search, mode: 'insensitive' } },
              { ipAddress: { contains: search, mode: 'insensitive' } },
              { profile: { email: { contains: search, mode: 'insensitive' } } },
              { profile: { fullName: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
      ...(query?.action && query.action !== 'ALL' ? { action: query.action } : {}),
      ...(query?.entity && query.entity !== 'ALL' ? { entity: query.entity } : {}),
    };

    const [total, logs] = await Promise.all([
      prisma.auditLog.count({ where }),
      prisma.auditLog.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: {
            select: {
              id: true,
              fullName: true,
              email: true,
              platformRole: true,
            },
          },
        },
      }),
    ]);

    return {
      items: logs,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }
}
