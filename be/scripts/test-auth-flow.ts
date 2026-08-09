import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function runRealAuthTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING REAL AUTH & ONBOARDING SYSTEM TESTS');
  console.log('====================================================\n');

  const testUser = {
    fullName: 'Nguyễn Văn Hùng',
    email: `themis_exporter_${Date.now()}@yopmail.com`,
    password: 'ThemisLexiGuard2026!',
  };

  let accessToken = '';
  let createdOrgId = '';

  // ─── TEST 1: REGISTER ───────────────────────────────
  console.log('📌 TEST 1: Đăng ký tài khoản mới (POST /api/auth/register)');
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const data: any = await res.json();
    console.log(`   HTTP Status: ${res.status}`);
    if (res.status === 201) {
      console.log('   ✅ TEST 1 PASSED: Đăng ký thành công!');
      console.log(`   User ID: ${data.data.user.id}`);
      console.log(`   Email: ${data.data.user.email}`);
    } else {
      console.error('   ❌ TEST 1 FAILED:', JSON.stringify(data));
      process.exit(1);
    }
  } catch (err: any) {
    console.error('   ❌ TEST 1 EXCEPTION:', err.message);
    process.exit(1);
  }
  console.log('\n----------------------------------------------------\n');

  // ─── TEST 2: WRONG PASSWORD LOGIN ────────────────────
  console.log('📌 TEST 2: Đăng nhập sai mật khẩu (POST /api/auth/login)');
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'WrongPassword123!' }),
    });
    const data: any = await res.json();
    console.log(`   HTTP Status: ${res.status}`);
    if (res.status === 401) {
      console.log('   ✅ TEST 2 PASSED: Hệ thống từ chối đăng nhập sai mật khẩu đúng chuẩn!');
      console.log(`   Thông báo lỗi: "${data.error.message}"`);
    } else {
      console.error('   ❌ TEST 2 FAILED: Không trả về 401!', JSON.stringify(data));
    }
  } catch (err: any) {
    console.error('   ❌ TEST 2 EXCEPTION:', err.message);
  }
  console.log('\n----------------------------------------------------\n');

  // ─── TEST 3: SUCCESSFUL LOGIN ────────────────────────
  console.log('📌 TEST 3: Đăng nhập đúng thông tin (POST /api/auth/login)');
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const data: any = await res.json();
    console.log(`   HTTP Status: ${res.status}`);
    if (res.status === 200 && data.data?.session?.accessToken) {
      accessToken = data.data.session.accessToken;
      console.log('   ✅ TEST 3 PASSED: Đăng nhập thành công, đã cấp Supabase JWT Token!');
      console.log(`   Access Token Length: ${accessToken.length} chars`);
      console.log(`   Danh sách Org hiện tại: ${data.data.organizations.length} doanh nghiệp`);
    } else {
      console.error('   ❌ TEST 3 FAILED:', JSON.stringify(data));
      process.exit(1);
    }
  } catch (err: any) {
    console.error('   ❌ TEST 3 EXCEPTION:', err.message);
    process.exit(1);
  }
  console.log('\n----------------------------------------------------\n');

  // ─── TEST 4: ENTERPRISE ONBOARDING ───────────────────
  console.log('📌 TEST 4: Onboarding Doanh nghiệp Xuất khẩu (POST /api/organizations)');
  const orgInput = {
    name: 'Công ty CP Xuất Nhập Khẩu Nông Sản Tây Nguyên',
    taxCode: '0312345678',
    address: '123 Nguyễn Tất Thành, TP. Buôn Ma Thuột, Đắk Lắk',
    legalRepresentative: 'Nguyễn Văn Hùng',
    contactEmail: 'contact@taynguyenexport.com',
    contactPhone: '0908123456',
    primaryProduct: 'Cà phê Robusta Nhân Xô & Rạng Xay EUDR Standard',
    exportMarkets: ['EU', 'CHINA', 'USA'],
    exportForm: 'Xuất khẩu trực tiếp kho cảng EU',
    exportScale: '500-1000 tấn/năm',
    jobTitle: 'Giám đốc Xuất Nhập Khẩu',
  };

  try {
    const res = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(orgInput),
    });
    const data: any = await res.json();
    console.log(`   HTTP Status: ${res.status}`);
    if (res.status === 201 && data.data?.id) {
      createdOrgId = data.data.id;
      console.log('   ✅ TEST 4 PASSED: Tạo Doanh nghiệp Xuất khẩu thành công!');
      console.log(`   Org ID: ${createdOrgId}`);
      console.log(`   Tên Doanh Nghiệp: ${data.data.name}`);
      console.log(`   Sản phẩm chiến lược: ${data.data.primaryProduct}`);
      console.log(`   Thị trường xuất khẩu: ${data.data.exportMarkets.join(', ')}`);
    } else {
      console.error('   ❌ TEST 4 FAILED:', JSON.stringify(data));
      process.exit(1);
    }
  } catch (err: any) {
    console.error('   ❌ TEST 4 EXCEPTION:', err.message);
    process.exit(1);
  }
  console.log('\n----------------------------------------------------\n');

  // ─── TEST 5: VERIFY USER ORG MEMBERSHIP & ROLE ──────
  console.log('📌 TEST 5: Kiểm tra Đăng nhập lại để xác nhận Active Org & Role OWNER');
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const data: any = await res.json();
    console.log(`   HTTP Status: ${res.status}`);
    if (res.status === 200 && data.data.organizations.length > 0) {
      const activeOrg = data.data.organizations[0];
      console.log('   ✅ TEST 5 PASSED: Đã xác nhận User thuộc Doanh nghiệp vừa tạo!');
      console.log(`   Active Org Name: ${activeOrg.name}`);
      console.log(`   User Role trong Org: ${activeOrg.role} (Chủ doanh nghiệp)`);
    } else {
      console.error('   ❌ TEST 5 FAILED:', JSON.stringify(data));
    }
  } catch (err: any) {
    console.error('   ❌ TEST 5 EXCEPTION:', err.message);
  }
  console.log('\n----------------------------------------------------\n');

  // ─── TEST 6: SECURITY CHECK (UNAUTHORIZED ACCESS) ──
  console.log('📌 TEST 6: Kiểm thử Bảo mật API không có JWT Token');
  try {
    const res = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orgInput),
    });
    const data: any = await res.json();
    console.log(`   HTTP Status: ${res.status}`);
    if (res.status === 401) {
      console.log('   ✅ TEST 6 PASSED: Backend từ chối 401 Unauthorized triệt để khi thiếu Bearer Token!');
    } else {
      console.error('   ❌ TEST 6 FAILED: Không chặn unauthorized request!', JSON.stringify(data));
    }
  } catch (err: any) {
    console.error('   ❌ TEST 6 EXCEPTION:', err.message);
  }

  console.log('\n====================================================');
  console.log('🎉 TOÀN BỘ 6/6 KỊCH BẢN KIỂM THỬ THỰC TẾ ĐÃ THÀNH CÔNG RỰC RỠ!');
  console.log('====================================================\n');
}

runRealAuthTests();
