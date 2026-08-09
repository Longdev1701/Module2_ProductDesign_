import { prisma } from '../src/lib/prisma';
import { supabaseAdmin } from '../src/lib/supabase';

const API_BASE = 'http://localhost:3001/api';

async function runAdminProvisioningTest() {
  console.log('====================================================');
  console.log('🧪 BẮT ĐẦU KIỂM THỬ: ADMIN-PROVISIONED ENTERPRISE SAAS');
  console.log('====================================================');

  const timestamp = Date.now();
  const userEmail = `enterprise_user_${timestamp}@yopmail.com`;
  const adminEmail = `platform_admin_${timestamp}@yopmail.com`;
  const testPassword = 'ThemisLexiGuard2026!';

  let userId: string = '';
  let adminId: string = '';
  let userToken: string = '';
  let adminToken: string = '';
  let createdOrgId: string = '';

  try {
    // ----------------------------------------------------
    // STEP 1: Create 1 Regular User & 1 Platform Admin Account
    // ----------------------------------------------------
    console.log('\n--- 1. KHỞI TẠO TÀI KHOẢN ---');
    const uAuth = await supabaseAdmin.auth.admin.createUser({ email: userEmail, password: testPassword, email_confirm: true });
    userId = uAuth.data.user!.id;
    await prisma.profile.create({
      data: { id: userId, email: userEmail, fullName: 'Cán bộ XNK Mới', platformRole: 'USER' },
    });
    console.log(`✅ Đã tạo Regular User: ${userEmail} (Role: USER)`);

    const aAuth = await supabaseAdmin.auth.admin.createUser({ email: adminEmail, password: testPassword, email_confirm: true });
    adminId = aAuth.data.user!.id;
    await prisma.profile.create({
      data: { id: adminId, email: adminEmail, fullName: 'Quản Trị Viên Hệ Thống', platformRole: 'SUPER_ADMIN' },
    });
    console.log(`✅ Đã tạo Platform Admin: ${adminEmail} (Role: SUPER_ADMIN)`);

    // Login both to get tokens
    const uLog = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, password: testPassword }),
    });
    const uJson: any = await uLog.json();
    userToken = uJson.data.session.accessToken;

    const aLog = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: adminEmail, password: testPassword }),
    });
    const aJson: any = await aLog.json();
    adminToken = aJson.data.session.accessToken;

    // ----------------------------------------------------
    // STEP 2: Security Boundary Check - Regular User Blocked
    // ----------------------------------------------------
    console.log('\n--- 2. KIỂM TRA RANH GIỚI BẢO MẬT (SECURITY BOUNDARY) ---');
    const blockedRes = await fetch(`${API_BASE}/admin/organizations`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log(`User gọi GET /api/admin/organizations ──► HTTP Status: ${blockedRes.status}`);
    if (blockedRes.status === 403) {
      console.log('✅ PASSED: Backend đã CHẶN THÀNH CÔNG User thường truy cập Admin API (403 Forbidden).');
    } else {
      throw new Error(`FAILED: Kỳ vọng 403 nhưng nhận ${blockedRes.status}`);
    }

    // ----------------------------------------------------
    // STEP 3: Platform Admin Creates Enterprise
    // ----------------------------------------------------
    console.log('\n--- 3. PLATFORM ADMIN TẠO DOANH NGHIỆP XUẤT KHẨU ---');
    const createOrgRes = await fetch(`${API_BASE}/admin/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: `Tập Đoàn Nông Sản Tây Nguyên ${timestamp}`,
        taxCode: `MST-${timestamp}`,
        address: 'Buôn Ma Thuột, Đắk Lắk',
        legalRepresentative: 'Nguyễn Văn Admin',
        contactEmail: adminEmail,
        primaryProduct: 'Cà phê Robusta EUDR',
        exportMarkets: ['EU', 'USA'],
      }),
    });
    const createOrgJson: any = await createOrgRes.json();
    console.log(`Admin tạo Doanh nghiệp ──► HTTP Status: ${createOrgRes.status}`);
    if (createOrgRes.status === 201 && createOrgJson.data?.id) {
      createdOrgId = createOrgJson.data.id;
      console.log(`✅ PASSED: Khởi tạo Doanh nghiệp thành công (Org ID: ${createdOrgId})`);
    } else {
      throw new Error(`FAILED: Tạo doanh nghiệp thất bại: ${JSON.stringify(createOrgJson)}`);
    }

    // ----------------------------------------------------
    // STEP 4: Admin Provisions User Membership & Role
    // ----------------------------------------------------
    console.log('\n--- 4. ADMIN CẤP QUYỀN VÀO DOANH NGHIỆP (COMPLIANCE ROLE) ---');
    const assignRes = await fetch(`${API_BASE}/admin/organizations/${createdOrgId}/assign-member`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        userId: userId,
        role: 'COMPLIANCE',
      }),
    });
    const assignJson: any = await assignRes.json();
    console.log(`Admin cấp quyền COMPLIANCE cho User ──► HTTP Status: ${assignRes.status}`);
    if (assignRes.status === 200 && assignJson.data?.role === 'COMPLIANCE') {
      console.log(`✅ PASSED: Đã cấp quyền COMPLIANCE cho User ${userEmail} thành công mà KHÔNG CẦN BIẾT PASSWORD.`);
    } else {
      throw new Error(`FAILED: Cấp quyền thất bại: ${JSON.stringify(assignJson)}`);
    }

    // ----------------------------------------------------
    // STEP 5: User Logins & Receives Assigned Membership
    // ----------------------------------------------------
    console.log('\n--- 5. VERIFY USER LOGIN RECEIVES PROVISIONED MEMBERSHIP ---');
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const meJson: any = await meRes.json();
    console.log(`User gọi GET /api/auth/me ──► HTTP Status: ${meRes.status}`);
    if (meJson.data?.organizations?.length > 0 && meJson.data.organizations[0].role === 'COMPLIANCE') {
      console.log(`✅ PASSED: User đã tự động nhận Doanh nghiệp: "${meJson.data.organizations[0].name}" với vai trò COMPLIANCE.`);
    } else {
      throw new Error(`FAILED: User chưa nhận được Doanh nghiệp đã cấp: ${JSON.stringify(meJson)}`);
    }

    console.log('\n====================================================');
    console.log('🎉 TẤT CẢ 5 BƯỚC KIỂM THỬ ADMIN PROVISIONING ĐỀU PASSED 100%!');
    console.log('====================================================');
  } catch (err: any) {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
  } finally {
    // Cleanup test data
    if (createdOrgId) {
      await prisma.organizationMember.deleteMany({ where: { organizationId: createdOrgId } });
      await prisma.organization.deleteMany({ where: { id: createdOrgId } });
    }
    if (userId) {
      await prisma.auditLog.deleteMany({ where: { userId } });
      await prisma.profile.deleteMany({ where: { id: userId } });
      await supabaseAdmin.auth.admin.deleteUser(userId);
    }
    if (adminId) {
      await prisma.auditLog.deleteMany({ where: { userId: adminId } });
      await prisma.profile.deleteMany({ where: { id: adminId } });
      await supabaseAdmin.auth.admin.deleteUser(adminId);
    }
    await prisma.$disconnect();
  }
}

runAdminProvisioningTest();
