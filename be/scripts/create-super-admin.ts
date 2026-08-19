import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);
const prisma = new PrismaClient();

async function run() {
  const email = 'admin@themis.vn';
  const password = 'Admin123456@';
  const fullName = 'Themis Super Admin';

  const { data: listData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const existing = listData?.users?.find((u) => u.email === email);
  let userId: string;

  if (existing) {
    console.log('User exists in Supabase Auth, updating password...');
    await supabaseAdmin.auth.admin.updateUserById(existing.id, { password, email_confirm: true });
    userId = existing.id;
  } else {
    console.log('Creating new user in Supabase Auth...');
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });
    if (error || !data.user) throw error || new Error('No user returned');
    userId = data.user.id;
  }

  // Update Profile
  await prisma.profile.upsert({
    where: { id: userId },
    update: { fullName, jobTitle: 'Super Administrator', platformRole: 'SUPER_ADMIN', email },
    create: { id: userId, email, fullName, jobTitle: 'Super Administrator', platformRole: 'SUPER_ADMIN' },
  });

  // Attach to Demo Org
  const org = await prisma.organization.findFirst();
  if (org) {
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: {
          organizationId: org.id,
          userId: userId,
        },
      },
      update: { role: 'OWNER', status: 'ACTIVE' },
      create: {
        organizationId: org.id,
        userId: userId,
        role: 'OWNER',
        status: 'ACTIVE',
      },
    });
    console.log('Attached to organization:', org.name);
  }

  console.log('══════════════════════════════════════════════════════════');
  console.log('✅ SUPER ADMIN CONFIGURED SUCCESSFULLY:');
  console.log('   Email   :', email);
  console.log('   Password:', password);
  console.log('   Role    : SUPER_ADMIN & OWNER');
  console.log('══════════════════════════════════════════════════════════');
}

run()
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
