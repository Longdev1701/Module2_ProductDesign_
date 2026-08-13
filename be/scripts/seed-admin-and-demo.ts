/**
 * SEED SCRIPT — Tạo tài khoản Admin và Doanh nghiệp mẫu Sầu riêng
 *
 * Chạy: npx tsx scripts/seed-admin-and-demo.ts
 *       (hoặc: npx ts-node -r tsconfig-paths/register scripts/seed-admin-and-demo.ts)
 *
 * Yêu cầu: File .env phải có SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL
 * Idempotent: Có thể chạy nhiều lần mà không tạo duplicate.
 */

import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const prisma = new PrismaClient();

// ─── CẤU HÌNH DỮ LIỆU SEED ──────────────────────────────────────────────────

const ADMIN_USER = {
  email: 'rochthi59@gmail.com',
  password: 'Admin123@',
  fullName: 'Roch Thi (Platform Admin)',
  jobTitle: 'Platform Administrator',
  platformRole: 'PLATFORM_ADMIN' as const,
};

const BUSINESS_USER = {
  email: 'rochthi2006@gmail.com',
  password: 'Demo2026!',   // mật khẩu khởi tạo — user có thể đổi qua forgot-password
  fullName: 'Roch Thị Lan Anh',
  jobTitle: 'Giám đốc Xuất Nhập Khẩu',
};

const DEMO_ORGANIZATION = {
  name: 'Công ty TNHH Xuất Khẩu Sầu Riêng Tây Nguyên',
  taxCode: '0601234567',
  address: '45 Phan Chu Trinh, TP. Buôn Ma Thuột, Đắk Lắk, Việt Nam',
  legalRepresentative: 'Roch Thị Lan Anh',
  contactEmail: 'export@sauriengwesternhighlands.vn',
  contactPhone: '0262 3812 456',
  primaryProduct: 'Sầu riêng Monthong & Ri6 — Mã HS 0810.60.00',
  exportMarkets: ['CHINA'],
  exportForm: 'Xuất khẩu chính ngạch — GACC Protocol',
  exportScale: '200–500 tấn/mùa vụ',
};

const DEMO_MEMBER_ROLE = 'OWNER' as const;

// ─── HÀM TIỆN ÍCH ─────────────────────────────────────────────────────────────

async function createOrUpdateSupabaseUser(
  email: string,
  password: string,
  fullName: string
): Promise<string> {
  const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const existing = listData?.users?.find((u) => u.email === email);

  if (existing) {
    console.log(`   ⚠️  Đã tồn tại trong Supabase Auth: ${email}`);
    await supabaseAdmin.auth.admin.updateUserById(existing.id, { password });
    console.log(`   🔄  Password đã được reset cho: ${email}`);
    return existing.id;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (error || !data.user) {
    throw new Error(`Tạo Supabase user thất bại (${email}): ${error?.message}`);
  }

  console.log(`   ✅  Đã tạo Supabase Auth user: ${email}`);
  return data.user.id;
}

async function upsertProfile(params: {
  id: string;
  email: string;
  fullName: string;
  jobTitle?: string;
  platformRole?: 'USER' | 'SUPPORT' | 'PLATFORM_ADMIN' | 'SUPER_ADMIN';
}) {
  return prisma.profile.upsert({
    where: { id: params.id },
    update: {
      fullName: params.fullName,
      jobTitle: params.jobTitle ?? null,
      platformRole: params.platformRole ?? 'USER',
    },
    create: {
      id: params.id,
      email: params.email,
      fullName: params.fullName,
      jobTitle: params.jobTitle ?? null,
      platformRole: params.platformRole ?? 'USER',
    },
  });
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🌱  THEMIS LEXIGUARD — SEED: Admin & Demo Durian Company');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ── BƯỚC 1: Tạo Platform Admin ──────────────────────────────────────────────
  console.log('📌 BƯỚC 1: Tạo tài khoản Platform Admin');
  const adminId = await createOrUpdateSupabaseUser(
    ADMIN_USER.email,
    ADMIN_USER.password,
    ADMIN_USER.fullName
  );
  const adminProfile = await upsertProfile({
    id: adminId,
    email: ADMIN_USER.email,
    fullName: ADMIN_USER.fullName,
    jobTitle: ADMIN_USER.jobTitle,
    platformRole: ADMIN_USER.platformRole,
  });
  console.log(`   ✅  Admin Profile ID: ${adminProfile.id}`);
  console.log(`   ✅  platformRole = PLATFORM_ADMIN\n`);

  // ── BƯỚC 2: Tạo Business User ───────────────────────────────────────────────
  console.log('📌 BƯỚC 2: Tạo tài khoản Doanh nghiệp mẫu');
  const bizId = await createOrUpdateSupabaseUser(
    BUSINESS_USER.email,
    BUSINESS_USER.password,
    BUSINESS_USER.fullName
  );
  const bizProfile = await upsertProfile({
    id: bizId,
    email: BUSINESS_USER.email,
    fullName: BUSINESS_USER.fullName,
    jobTitle: BUSINESS_USER.jobTitle,
    platformRole: 'USER',
  });
  console.log(`   ✅  Business Profile ID: ${bizProfile.id}\n`);

  // ── BƯỚC 3: Tạo Doanh nghiệp Sầu riêng ─────────────────────────────────────
  console.log('📌 BƯỚC 3: Tạo Doanh nghiệp Sầu riêng Tây Nguyên');
  let org = await prisma.organization.findFirst({
    where: { taxCode: DEMO_ORGANIZATION.taxCode },
  });

  if (org) {
    console.log(`   ⚠️  Doanh nghiệp đã tồn tại (taxCode: ${DEMO_ORGANIZATION.taxCode}), bỏ qua tạo mới.`);
  } else {
    org = await prisma.organization.create({
      data: {
        name: DEMO_ORGANIZATION.name,
        taxCode: DEMO_ORGANIZATION.taxCode,
        address: DEMO_ORGANIZATION.address,
        legalRepresentative: DEMO_ORGANIZATION.legalRepresentative,
        contactEmail: DEMO_ORGANIZATION.contactEmail,
        contactPhone: DEMO_ORGANIZATION.contactPhone,
        primaryProduct: DEMO_ORGANIZATION.primaryProduct,
        exportMarkets: DEMO_ORGANIZATION.exportMarkets,
        exportForm: DEMO_ORGANIZATION.exportForm,
        exportScale: DEMO_ORGANIZATION.exportScale,
      },
    });
    console.log(`   ✅  Tổ chức tạo thành công!`);
  }
  console.log(`   🏢  Org: ${org.name}`);
  console.log(`   📦  Org ID: ${org.id}`);
  console.log(`   🌏  Thị trường: ${DEMO_ORGANIZATION.exportMarkets.join(', ')}\n`);

  // ── BƯỚC 4: Gán Business User → OWNER ────────────────────────────────────────
  console.log('📌 BƯỚC 4: Gán thành viên vào doanh nghiệp');
  const member = await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: org.id,
        userId: bizProfile.id,
      },
    },
    update: { role: DEMO_MEMBER_ROLE, status: 'ACTIVE' },
    create: {
      organizationId: org.id,
      userId: bizProfile.id,
      role: DEMO_MEMBER_ROLE,
      status: 'ACTIVE',
    },
  });
  console.log(`   ✅  ${BUSINESS_USER.email} → ${DEMO_MEMBER_ROLE}`);
  console.log(`   🔑  Member ID: ${member.id}\n`);

  // ── BƯỚC 5: Audit Log ─────────────────────────────────────────────────────────
  console.log('📌 BƯỚC 5: Ghi Audit Log');
  await prisma.auditLog.create({
    data: {
      userId: adminProfile.id,
      action: 'admin.seed_executed',
      entity: 'Organization',
      entityId: org.id,
      metadata: {
        adminEmail: ADMIN_USER.email,
        bizEmail: BUSINESS_USER.email,
        orgName: DEMO_ORGANIZATION.name,
        orgRole: DEMO_MEMBER_ROLE,
        seedAt: new Date().toISOString(),
      },
      ipAddress: '127.0.0.1',
    },
  });
  console.log('   ✅  Audit log ghi thành công\n');

  // ── TỔNG KẾT ─────────────────────────────────────────────────────────────────
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🎉  SEED HOÀN TẤT — Thông tin đăng nhập:');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  👤 PLATFORM ADMIN');
  console.log(`     Email    : ${ADMIN_USER.email}`);
  console.log(`     Password : ${ADMIN_USER.password}`);
  console.log(`     Truy cập : http://localhost:3000/admin`);
  console.log('');
  console.log('  🏢 BUSINESS USER (OWNER — Sầu riêng Tây Nguyên)');
  console.log(`     Email    : ${BUSINESS_USER.email}`);
  console.log(`     Password : ${BUSINESS_USER.password}`);
  console.log(`     Org      : ${DEMO_ORGANIZATION.name}`);
  console.log(`     Role     : OWNER → Truy cập Dashboard đầy đủ`);
  console.log(`     Truy cập : http://localhost:3000/dashboard`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('❌  Seed thất bại:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
