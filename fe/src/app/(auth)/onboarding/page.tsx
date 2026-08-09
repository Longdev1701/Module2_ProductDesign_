"use client";

/**
 * /onboarding — DISABLED trong kiến trúc Admin-Provisioned SaaS
 *
 * User không được phép tự tạo Organization.
 * Chỉ Platform Admin mới có quyền tạo Org và cấp membership.
 * Page này redirect ngay về /pending-access.
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    // Trong kiến trúc Admin-Provisioned, người dùng không tự onboarding.
    // Chuyển ngay về trang chờ cấp quyền.
    router.replace('/pending-access');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fb]">
      <p className="text-sm text-[#434653]">Đang chuyển hướng...</p>
    </div>
  );
}
