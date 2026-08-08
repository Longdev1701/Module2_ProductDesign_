import { prisma } from '../../lib/prisma';
import { createAuditLog } from '../../services/auditLogService';
import { AdminCreateOrgInput, AdminAssignMemberInput } from './schema';

export class AdminService {
  static async createOrganization(adminUserId: string, input: AdminCreateOrgInput, ipAddress?: string) {
    const org = await prisma.organization.create({
      data: {
        name: input.name,
        taxCode: input.taxCode,
        address: input.address,
        legalRepresentative: input.legalRepresentative,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        primaryProduct: input.primaryProduct,
        exportMarkets: input.exportMarkets,
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

  static async assignMember(adminUserId: string, orgId: string, input: AdminAssignMemberInput, ipAddress?: string) {
    // 1. Check if org exists
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
    });
    if (!org) {
      throw new Error('Doanh nghiệp không tồn tại');
    }

    // 2. Check if user profile exists
    const profile = await prisma.profile.findUnique({
      where: { id: input.userId },
    });
    if (!profile) {
      throw new Error('Người dùng không tồn tại');
    }

    // 3. Upsert organization member
    const member = await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: input.userId,
        },
      },
      update: {
        role: input.role,
        status: 'ACTIVE',
      },
      create: {
        organizationId: orgId,
        userId: input.userId,
        role: input.role,
        status: 'ACTIVE',
      },
    });

    await createAuditLog({
      userId: adminUserId,
      action: 'admin.member_assigned',
      entity: 'OrganizationMember',
      entityId: member.id,
      metadata: { orgId, targetUserId: input.userId, role: input.role },
      ipAddress,
    });

    return member;
  }

  static async getAllOrganizations() {
    const orgs = await prisma.organization.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        members: {
          include: {
            profile: {
              select: {
                id: true,
                fullName: true,
                email: true,
                jobTitle: true,
              },
            },
          },
        },
      },
    });

    return orgs;
  }

  static async getAllUsers() {
    const users = await prisma.profile.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        organizationMembers: {
          include: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return users.map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      jobTitle: u.jobTitle,
      platformRole: u.platformRole,
      createdAt: u.createdAt,
      organizations: u.organizationMembers.map((m: any) => ({
        id: m.organization.id,
        name: m.organization.name,
        role: m.role,
        status: m.status,
      })),
    }));
  }
}
