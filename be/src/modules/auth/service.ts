import { prisma } from '../../lib/prisma';
import { supabasePublic, supabaseAdmin } from '../../lib/supabase';
import { RegisterInput, LoginInput, UpdateProfileInput } from './schema';
import { createAuditLog } from '../../services/auditLogService';

export class AuthService {
  static async register(input: RegisterInput, ipAddress?: string) {
    // 1. SignUp with Supabase Auth Admin to avoid public email rate limits
    let userId = '';
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: input.email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        full_name: input.fullName,
      },
    });

    if (authError || !authData?.user) {
      // Fallback to public signUp if admin createUser fails
      const { data: pubAuth, error: pubError } = await supabasePublic.auth.signUp({
        email: input.email,
        password: input.password,
        options: { data: { full_name: input.fullName } },
      });
      if (pubError || !pubAuth.user) {
        throw new Error(pubError?.message || authError?.message || 'Đăng ký tài khoản thất bại');
      }
      userId = pubAuth.user.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, { email_confirm: true });
    } else {
      userId = authData.user.id;
    }

    // 2. Create or Update Profile record in database
    const profile = await prisma.profile.upsert({
      where: { id: userId },
      update: {
        fullName: input.fullName,
        jobTitle: input.jobTitle || null,
      },
      create: {
        id: userId,
        email: input.email,
        fullName: input.fullName,
        jobTitle: input.jobTitle || null,
      },
    });

    // 3. Log audit event
    await createAuditLog({
      userId,
      action: 'user.registered',
      entity: 'Profile',
      entityId: profile.id,
      metadata: { email: input.email },
      ipAddress,
    });

    return {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        jobTitle: profile.jobTitle,
      },
    };
  }

  static async login(input: LoginInput, ipAddress?: string) {
    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } = await supabasePublic.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (authError || !authData.user || !authData.session) {
      // Log login failure
      if (authData?.user?.id) {
        await createAuditLog({
          userId: authData.user.id,
          action: 'user.login_failed',
          entity: 'Profile',
          metadata: { email: input.email, reason: authError?.message },
          ipAddress,
        });
      }
      throw new Error(authError?.message || 'Email hoặc mật khẩu không chính xác');
    }

    const userId = authData.user.id;

    // 2. Ensure Profile exists in database
    let profile = await prisma.profile.findUnique({
      where: { id: userId },
      include: {
        organizationMembers: {
          where: { status: 'ACTIVE' },
          include: {
            organization: true,
          },
        },
      },
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: userId,
          email: authData.user.email || input.email,
          fullName: authData.user.user_metadata?.full_name || input.email.split('@')[0],
        },
        include: {
          organizationMembers: {
            where: { status: 'ACTIVE' },
            include: {
              organization: true,
            },
          },
        },
      });
    }

    // 3. Audit Log
    await createAuditLog({
      userId,
      action: 'user.login_success',
      entity: 'Profile',
      entityId: profile.id,
      ipAddress,
    });

    return {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        jobTitle: profile.jobTitle,
        platformRole: profile.platformRole,
      },
      organizations: profile.organizationMembers.map((m: any) => ({
        id: m.organization.id,
        name: m.organization.name,
        role: m.role,
        primaryProduct: m.organization.primaryProduct,
      })),
      session: {
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token,
        expiresAt: authData.session.expires_at,
      },
    };
  }

  static async getMe(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { id: userId },
      include: {
        organizationMembers: {
          where: { status: 'ACTIVE' },
          include: {
            organization: true,
          },
        },
      },
    });

    if (!profile) {
      throw new Error('Không tìm thấy thông tin hồ sơ người dùng');
    }

    return {
      user: {
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        avatarUrl: profile.avatarUrl,
        jobTitle: profile.jobTitle,
        platformRole: profile.platformRole, // cần thiết để FE redirect đúng
        createdAt: profile.createdAt,
      },
      organizations: profile.organizationMembers.map((m: any) => ({
        id: m.organization.id,
        name: m.organization.name,
        role: m.role,
        taxCode: m.organization.taxCode,
        primaryProduct: m.organization.primaryProduct,
        exportMarkets: m.organization.exportMarkets,
      })),
    };
  }

  static async updateProfile(userId: string, input: UpdateProfileInput) {
    const updated = await prisma.profile.update({
      where: { id: userId },
      data: {
        ...(input.fullName && { fullName: input.fullName }),
        ...(input.avatarUrl !== undefined && { avatarUrl: input.avatarUrl }),
        ...(input.jobTitle !== undefined && { jobTitle: input.jobTitle }),
      },
    });

    return updated;
  }

  static async logout(userId: string, ipAddress?: string) {
    // 1. Log audit event
    await createAuditLog({
      userId,
      action: 'user.logout',
      entity: 'Profile',
      entityId: userId,
      ipAddress,
    });

    return { message: 'Đăng xuất thành công' };
  }

  static async forgotPassword(email: string, ipAddress?: string) {
    // Check if profile exists
    const profile = await prisma.profile.findUnique({
      where: { email },
    });

    if (!profile) {
      // Return friendly message even if email not found to prevent user enumeration
      return { message: 'Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi.' };
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    // Call Supabase resetPasswordForEmail or trigger reset link
    await supabasePublic.auth.resetPasswordForEmail(email, {
      redirectTo: `${frontendUrl}/reset-password`,
    });

    await createAuditLog({
      userId: profile.id,
      action: 'user.forgot_password_requested',
      entity: 'Profile',
      entityId: profile.id,
      metadata: { email },
      ipAddress,
    });

    return { message: 'Yêu cầu đặt lại mật khẩu đã được xử lý thành công.' };
  }

  static async resetPassword(email: string, newPassword: string, ipAddress?: string) {
    const profile = await prisma.profile.findUnique({
      where: { email },
    });

    if (!profile) {
      throw new Error('Không tìm thấy tài khoản người dùng.');
    }

    // Update password via Supabase Admin SDK
    const { error } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message || 'Cập nhật mật khẩu thất bại.');
    }

    await createAuditLog({
      userId: profile.id,
      action: 'user.password_reset_success',
      entity: 'Profile',
      entityId: profile.id,
      ipAddress,
    });

    return { message: 'Đặt lại mật khẩu mới thành công! Bạn có thể đăng nhập ngay.' };
  }
}
