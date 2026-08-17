import { prisma } from '../../lib/prisma';
import { CreateOrganizationInput, UpdateOrganizationInput, InviteMemberInput, JoinOrganizationInput } from './schema';
import { OrganizationRole } from '@prisma/client';
import { createAuditLog } from '../../services/auditLogService';
import { ApiError } from '../../lib/api-error';
import crypto from 'crypto';

export class OrganizationService {
  static async createOrganization(userId: string, input: CreateOrganizationInput, ipAddress?: string) {
    // 1. Transaction to create Organization + set User as OWNER + update Profile jobTitle
    const result = await prisma.$transaction(async (tx: any) => {
      const org = await tx.organization.create({
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

      // Create owner member
      const member = await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId: userId,
          role: OrganizationRole.OWNER,
          status: 'ACTIVE',
        },
      });

      // Update user job title if provided
      if (input.jobTitle) {
        await tx.profile.update({
          where: { id: userId },
          data: { jobTitle: input.jobTitle },
        });
      }

      return { org, member };
    });

    // 2. Audit log
    await createAuditLog({
      userId,
      action: 'org.created',
      entity: 'Organization',
      entityId: result.org.id,
      metadata: { orgName: result.org.name },
      ipAddress,
    });

    return result.org;
  }

  static async getMyOrganizations(userId: string) {
    const members = await prisma.organizationMember.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        organization: true,
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    return members.map((m: any) => ({
      id: m.organization.id,
      name: m.organization.name,
      taxCode: m.organization.taxCode,
      primaryProduct: m.organization.primaryProduct,
      exportMarkets: m.organization.exportMarkets,
      role: m.role,
      joinedAt: m.joinedAt,
    }));
  }

  static async getOrganizationDetails(orgId: string) {
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        members: {
          include: {
            profile: {
              select: {
                id: true,
                email: true,
                fullName: true,
                avatarUrl: true,
                jobTitle: true,
              },
            },
          },
        },
      },
    });

    if (!org) {
      throw new Error('Tổ chức không tồn tại');
    }

    return org;
  }

  static async updateOrganization(orgId: string, userId: string, input: UpdateOrganizationInput, ipAddress?: string) {
    const updated = await prisma.organization.update({
      where: { id: orgId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.taxCode !== undefined && { taxCode: input.taxCode }),
        ...(input.address !== undefined && { address: input.address }),
        ...(input.legalRepresentative !== undefined && { legalRepresentative: input.legalRepresentative }),
        ...(input.contactEmail !== undefined && { contactEmail: input.contactEmail }),
        ...(input.contactPhone !== undefined && { contactPhone: input.contactPhone }),
        ...(input.primaryProduct && { primaryProduct: input.primaryProduct }),
        ...(input.exportMarkets && { exportMarkets: input.exportMarkets }),
        ...(input.exportForm !== undefined && { exportForm: input.exportForm }),
        ...(input.exportScale !== undefined && { exportScale: input.exportScale }),
      },
    });

    await createAuditLog({
      userId,
      action: 'org.updated',
      entity: 'Organization',
      entityId: orgId,
      ipAddress,
    });

    return updated;
  }

  static async inviteMember(orgId: string, inviterId: string, input: InviteMemberInput, ipAddress?: string) {
    // Check if target email is already an active member
    const existingMember = await prisma.organizationMember.findFirst({
      where: {
        organizationId: orgId,
        profile: {
          email: input.email,
        },
        status: 'ACTIVE',
      },
    });

    if (existingMember) {
      throw new Error('Email này đã là thành viên chính thức của tổ chức');
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const invitation = await prisma.invitation.create({
      data: {
        organizationId: orgId,
        email: input.email,
        role: input.role,
        token,
        expiresAt,
      },
    });

    await createAuditLog({
      userId: inviterId,
      action: 'org.member_invited',
      entity: 'Invitation',
      entityId: invitation.id,
      metadata: { inviteeEmail: input.email, role: input.role, orgId },
      ipAddress,
    });

    return invitation;
  }

  static async joinOrganization(userId: string, userEmail: string, input: JoinOrganizationInput, ipAddress?: string) {
    const invitation = await prisma.invitation.findUnique({
      where: { token: input.token },
    });

    if (!invitation || invitation.expiresAt < new Date()) {
      throw new Error('Mã lời mời không tồn tại hoặc đã hết hạn');
    }

    if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
      throw new Error('Lời mời này dành cho email khác');
    }

    const member = await prisma.$transaction(async (tx: any) => {
      const newMember = await tx.organizationMember.create({
        data: {
          organizationId: invitation.organizationId,
          userId: userId,
          role: invitation.role,
          status: 'ACTIVE',
        },
      });

      await tx.invitation.delete({
        where: { id: invitation.id },
      });

      return newMember;
    });

    await createAuditLog({
      userId,
      action: 'org.member_joined',
      entity: 'OrganizationMember',
      entityId: member.id,
      metadata: { orgId: invitation.organizationId, role: invitation.role },
      ipAddress,
    });

    return member;
  }

  static async updateMemberRole(
    orgId: string,
    operatorUserId: string,
    memberId: string,
    newRole: OrganizationRole,
    ipAddress?: string
  ) {
    const member = await prisma.organizationMember.findFirst({
      where: { id: memberId, organizationId: orgId },
    });

    if (!member) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy thành viên trong tổ chức');
    }

    if (member.role === OrganizationRole.OWNER && newRole !== OrganizationRole.OWNER) {
      const ownerCount = await prisma.organizationMember.count({
        where: { organizationId: orgId, role: OrganizationRole.OWNER, status: 'ACTIVE' },
      });
      if (ownerCount <= 1) {
        throw new ApiError(400, 'BAD_REQUEST', 'Không thể hạ quyền Chủ sở hữu duy nhất của tổ chức');
      }
    }

    const updated = await prisma.organizationMember.update({
      where: { id: memberId },
      data: { role: newRole },
      include: {
        profile: {
          select: {
            id: true,
            fullName: true,
            email: true,
            jobTitle: true,
            avatarUrl: true,
          },
        },
      },
    });

    await createAuditLog({
      userId: operatorUserId,
      action: 'org.member_role_changed',
      entity: 'OrganizationMember',
      entityId: memberId,
      metadata: { targetUserId: member.userId, oldRole: member.role, newRole, orgId },
      ipAddress,
    });

    return updated;
  }

  static async removeMember(
    orgId: string,
    operatorUserId: string,
    memberId: string,
    ipAddress?: string
  ) {
    const member = await prisma.organizationMember.findFirst({
      where: { id: memberId, organizationId: orgId },
    });

    if (!member) {
      throw new ApiError(404, 'NOT_FOUND', 'Không tìm thấy thành viên trong tổ chức');
    }

    if (member.role === OrganizationRole.OWNER) {
      const ownerCount = await prisma.organizationMember.count({
        where: { organizationId: orgId, role: OrganizationRole.OWNER, status: 'ACTIVE' },
      });
      if (ownerCount <= 1) {
        throw new ApiError(400, 'BAD_REQUEST', 'Không thể xóa Chủ sở hữu (Owner) duy nhất của tổ chức');
      }
    }

    await prisma.organizationMember.delete({
      where: { id: memberId },
    });

    await createAuditLog({
      userId: operatorUserId,
      action: 'org.member_removed',
      entity: 'OrganizationMember',
      entityId: memberId,
      metadata: { removedUserId: member.userId, orgId },
      ipAddress,
    });

    return { success: true, removedMemberId: memberId };
  }
}

