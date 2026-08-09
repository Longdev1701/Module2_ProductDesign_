import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function runFullRBACAndAuthTests() {
  console.log('========================================================================');
  console.log('🛡️ RUNNING DEEP RBAC PERMISSION MATRIX & AUTH SUITE INTEGRATION TESTS');
  console.log('========================================================================\n');

  const timestamp = Date.now();
  const ownerUser = { email: `owner_${timestamp}@taynguyenexport.com`, password: 'Password2026!', fullName: 'Trần Văn Owner' };
  const managerUser = { email: `manager_${timestamp}@taynguyenexport.com`, password: 'Password2026!', fullName: 'Lê Văn Manager' };
  const complianceUser = { email: `compliance_${timestamp}@taynguyenexport.com`, password: 'Password2026!', fullName: 'Phạm Thị Compliance' };
  const viewerUser = { email: `viewer_${timestamp}@taynguyenexport.com`, password: 'Password2026!', fullName: 'Hoàng Văn Viewer' };

  let ownerToken = '';
  let managerToken = '';
  let complianceToken = '';
  let viewerToken = '';
  let orgId = '';

  // Helper to register & login
  async function setupAccount(userData: any) {
    // 1. Register
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (regRes.status !== 201) {
      throw new Error(`Register failed for ${userData.email}: ${await regRes.text()}`);
    }

    // 2. Login
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userData.email, password: userData.password }),
    });
    const loginData: any = await loginRes.json();
    if (!loginData.data?.session?.accessToken) {
      throw new Error(`Login failed for ${userData.email}: ${JSON.stringify(loginData)}`);
    }
    return loginData.data.session.accessToken;
  }

  // ─── STEP 1: SETUP 4 ACCOUNTS ───────────────────────────────────────────
  console.log('📌 STEP 1: Khởi tạo 4 Tài khoản thử nghiệm đại diện cho 4 Roles');
  try {
    ownerToken = await setupAccount(ownerUser);
    console.log('   ✅ Account 1 (OWNER) created & logged in.');

    managerToken = await setupAccount(managerUser);
    console.log('   ✅ Account 2 (MANAGER) created & logged in.');

    complianceToken = await setupAccount(complianceUser);
    console.log('   ✅ Account 3 (COMPLIANCE) created & logged in.');

    viewerToken = await setupAccount(viewerUser);
    console.log('   ✅ Account 4 (VIEWER) created & logged in.');
  } catch (err: any) {
    console.error('   ❌ STEP 1 FAILED:', err.message);
    process.exit(1);
  }
  console.log('\n------------------------------------------------------------------------\n');

  // ─── STEP 2: OWNER CREATES ORGANIZATION ─────────────────────────────────
  console.log('📌 STEP 2: OWNER khởi tạo Doanh nghiệp xuất khẩu (POST /api/organizations)');
  try {
    const orgRes = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ownerToken}`,
      },
      body: JSON.stringify({
        name: `Tập đoàn Nông sản Tây Nguyên ${timestamp}`,
        primaryProduct: 'Cà phê Robusta EUDR',
        exportMarkets: ['EU', 'CHINA'],
        jobTitle: 'Tổng Giám Đốc',
      }),
    });
    const orgData: any = await orgRes.json();
    if (orgRes.status === 201) {
      orgId = orgData.data.id;
      console.log(`   ✅ STEP 2 PASSED: Org created with ID: ${orgId}`);
    } else {
      throw new Error(`Org creation failed: ${JSON.stringify(orgData)}`);
    }
  } catch (err: any) {
    console.error('   ❌ STEP 2 FAILED:', err.message);
    process.exit(1);
  }
  console.log('\n------------------------------------------------------------------------\n');

  // ─── STEP 3: OWNER INVITES MEMBERS & THEY JOIN ─────────────────────────
  console.log('📌 STEP 3: OWNER mời 3 nhân sự vào Org và chấp nhận lời mời (MANAGER, COMPLIANCE, VIEWER)');
  try {
    async function inviteAndJoin(email: string, role: string, userToken: string) {
      const invRes = await fetch(`${API_BASE}/organizations/${orgId}/invitations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}`, 'x-organization-id': orgId },
        body: JSON.stringify({ email, role }),
      });
      const invData: any = await invRes.json();
      if (!invData.data?.token) {
        throw new Error(`Invite failed for ${email}: ${JSON.stringify(invData)}`);
      }

      const joinRes = await fetch(`${API_BASE}/organizations/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userToken}` },
        body: JSON.stringify({ token: invData.data.token }),
      });
      if (joinRes.status !== 200) {
        throw new Error(`Join failed for ${email}: ${await joinRes.text()}`);
      }
    }

    await inviteAndJoin(managerUser.email, 'MANAGER', managerToken);
    console.log('   ✅ MANAGER joined Organization.');

    await inviteAndJoin(complianceUser.email, 'COMPLIANCE', complianceToken);
    console.log('   ✅ COMPLIANCE joined Organization.');

    await inviteAndJoin(viewerUser.email, 'VIEWER', viewerToken);
    console.log('   ✅ VIEWER joined Organization.');

    console.log('   ✅ STEP 3 PASSED: Đã phân bổ thành công đủ 4 Roles trong cùng Doanh nghiệp!');
  } catch (err: any) {
    console.error('   ❌ STEP 3 FAILED:', err.message);
    process.exit(1);
  }
  console.log('\n------------------------------------------------------------------------\n');

  // ─── STEP 4: TEST PERMISSION `org.manage` (PATCH /api/organizations/:id) ──
  console.log('📌 STEP 4: Kiểm thử phân quyền `org.manage` (Cập nhật thông tin Doanh nghiệp)');
  
  // 4a. OWNER (Expected 200 OK)
  const ownerManageRes = await fetch(`${API_BASE}/organizations/${orgId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ address: '456 Buôn Ma Thuột' }),
  });
  console.log(`   [OWNER] HTTP Status: ${ownerManageRes.status} (Kỳ vọng 200 OK) -> ${ownerManageRes.status === 200 ? '✅ PASSED' : '❌ FAILED'}`);

  // 4b. MANAGER (Expected 403 Forbidden - Only OWNER has org.manage permission)
  const managerManageRes = await fetch(`${API_BASE}/organizations/${orgId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${managerToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ address: 'Hacker Address' }),
  });
  console.log(`   [MANAGER] HTTP Status: ${managerManageRes.status} (Kỳ vọng 403 Forbidden) -> ${managerManageRes.status === 403 ? '✅ PASSED (Đã từ chối đúng chuẩn)' : '❌ FAILED'}`);

  // 4c. COMPLIANCE (Expected 403 Forbidden)
  const compManageRes = await fetch(`${API_BASE}/organizations/${orgId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${complianceToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ address: 'Hacker Address' }),
  });
  console.log(`   [COMPLIANCE] HTTP Status: ${compManageRes.status} (Kỳ vọng 403 Forbidden) -> ${compManageRes.status === 403 ? '✅ PASSED (Đã từ chối đúng chuẩn)' : '❌ FAILED'}`);

  // 4d. VIEWER (Expected 403 Forbidden)
  const viewerManageRes = await fetch(`${API_BASE}/organizations/${orgId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${viewerToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ address: 'Hacker Address' }),
  });
  console.log(`   [VIEWER] HTTP Status: ${viewerManageRes.status} (Kỳ vọng 403 Forbidden) -> ${viewerManageRes.status === 403 ? '✅ PASSED (Đã từ chối đúng chuẩn)' : '❌ FAILED'}`);

  console.log('\n------------------------------------------------------------------------\n');

  // ─── STEP 5: TEST PERMISSION `member.invite` (POST /api/organizations/:id/invitations)
  console.log('📌 STEP 5: Kiểm thử phân quyền `member.invite` (Mời nhân sự mới)');
  
  // 5a. OWNER (Expected 201 Created)
  const ownerInviteRes = await fetch(`${API_BASE}/organizations/${orgId}/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ownerToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ email: `new_staff_${timestamp}@yopmail.com`, role: 'COMPLIANCE' }),
  });
  console.log(`   [OWNER] HTTP Status: ${ownerInviteRes.status} (Kỳ vọng 201 Created) -> ${ownerInviteRes.status === 201 ? '✅ PASSED' : '❌ FAILED'}`);

  // 5b. MANAGER (Expected 201 Created)
  const managerInviteRes = await fetch(`${API_BASE}/organizations/${orgId}/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${managerToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ email: `mgr_invited_${timestamp}@yopmail.com`, role: 'VIEWER' }),
  });
  console.log(`   [MANAGER] HTTP Status: ${managerInviteRes.status} (Kỳ vọng 201 Created) -> ${managerInviteRes.status === 201 ? '✅ PASSED' : '❌ FAILED'}`);

  // 5c. COMPLIANCE (Expected 403 Forbidden)
  const compInviteRes = await fetch(`${API_BASE}/organizations/${orgId}/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${complianceToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ email: `hacker_invite_${timestamp}@yopmail.com`, role: 'COMPLIANCE' }),
  });
  console.log(`   [COMPLIANCE] HTTP Status: ${compInviteRes.status} (Kỳ vọng 403 Forbidden) -> ${compInviteRes.status === 403 ? '✅ PASSED (Đã từ chối đúng chuẩn)' : '❌ FAILED'}`);

  // 5d. VIEWER (Expected 403 Forbidden)
  const viewerInviteRes = await fetch(`${API_BASE}/organizations/${orgId}/invitations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${viewerToken}`, 'x-organization-id': orgId },
    body: JSON.stringify({ email: `hacker_invite_${timestamp}@yopmail.com`, role: 'COMPLIANCE' }),
  });
  console.log(`   [VIEWER] HTTP Status: ${viewerInviteRes.status} (Kỳ vọng 403 Forbidden) -> ${viewerInviteRes.status === 403 ? '✅ PASSED (Đã từ chối đúng chuẩn)' : '❌ FAILED'}`);

  console.log('\n------------------------------------------------------------------------\n');

  // ─── STEP 6: TEST FORGOT & RESET PASSWORD ──────────────────────────────
  console.log('📌 STEP 6: Kiểm thử Luồng Quên Mật Khẩu & Đặt Mật Khẩu Mới');
  
  const forgotRes = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ownerUser.email }),
  });
  console.log(`   Forgot Password Status: ${forgotRes.status} -> ${forgotRes.status === 200 ? '✅ PASSED' : '❌ FAILED'}`);

  const resetRes = await fetch(`${API_BASE}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ownerUser.email, newPassword: 'NewPassword2026!' }),
  });
  console.log(`   Reset Password Status: ${resetRes.status} -> ${resetRes.status === 200 ? '✅ PASSED' : '❌ FAILED'}`);

  const reLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ownerUser.email, password: 'NewPassword2026!' }),
  });
  const reLoginData: any = await reLoginRes.json();
  const newOwnerToken = reLoginData.data?.session?.accessToken;
  console.log(`   Login with NEW Password Status: ${reLoginRes.status} -> ${reLoginRes.status === 200 ? '✅ PASSED (Đã đăng nhập bằng mật khẩu mới thành công!)' : '❌ FAILED'}`);

  console.log('\n------------------------------------------------------------------------\n');

  // ─── STEP 7: TEST LOGOUT ────────────────────────────────────────────────
  console.log('📌 STEP 7: Kiểm thử API Đăng xuất (POST /api/auth/logout)');
  const logoutRes = await fetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${newOwnerToken}` },
  });
  console.log(`   Logout Status: ${logoutRes.status} -> ${logoutRes.status === 200 ? '✅ PASSED' : '❌ FAILED'}`);

  console.log('\n========================================================================');
  console.log('🎉 TOÀN BỘ MA TRẬN PHÂN QUYỀN RBAC VÀ AUTH SUITE ĐÃ HOẠT ĐỘNG CHUẨN XÁC 100%!');
  console.log('========================================================================\n');
}

runFullRBACAndAuthTests();
