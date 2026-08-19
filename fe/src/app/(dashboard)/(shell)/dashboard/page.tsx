"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { DashboardFeature } from "@/features/dashboard";
import type { AuthMeResponse, OrganizationSummary, UserProfile } from "@/types/api";

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse" aria-label="Đang tải dữ liệu tổng quan">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-lg bg-surface-container-high" />
        <div className="h-4 w-96 rounded-md bg-surface-container-low" />
      </div>

      {/* Top summary cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-surface-container-lowest border border-outline-variant/60 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high" />
              <div className="h-4 w-20 rounded bg-surface-container-high" />
            </div>
            <div className="h-8 w-16 rounded bg-surface-container-high" />
          </div>
        ))}
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[380px] rounded-xl bg-surface-container-lowest border border-outline-variant/60" />
          <div className="h-64 rounded-xl bg-surface-container-lowest border border-outline-variant/60" />
        </div>
        <div className="space-y-6">
          <div className="h-80 rounded-xl bg-surface-container-lowest border border-outline-variant/60" />
          <div className="h-48 rounded-xl bg-surface-container-lowest border border-outline-variant/60" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardRoutePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const cachedUser = localStorage.getItem("themis:user_cache");
    const cachedOrg = localStorage.getItem("themis:org_cache");
    let hasCache = false;
    if (cachedUser && cachedOrg) {
      try {
        setLoading(false);
        hasCache = true;
      } catch {
        // Ignore cache error
      }
    }

    async function checkAuth() {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const res = await api.get<AuthMeResponse>("/auth/me");
        const userData = res.data?.user;
        const orgs = res.data?.organizations;
        if (!userData) {
          router.replace("/login");
          return;
        }
        if (userData.platformRole === "SUPER_ADMIN" || userData.platformRole === "PLATFORM_ADMIN") {
          router.replace("/admin");
          return;
        }
        if (!orgs || orgs.length === 0) {
          router.replace("/pending-access");
          return;
        }
        localStorage.setItem("themis:user_cache", JSON.stringify(userData));
        localStorage.setItem("themis:org_cache", JSON.stringify(orgs[0]));

        const prevOrgId = localStorage.getItem("active_org_id");
        if (prevOrgId !== orgs[0].id) {
          localStorage.setItem("active_org_id", orgs[0].id);
          window.dispatchEvent(new Event("themis:organization-changed"));
        }
      } catch {
        if (!hasCache) {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    }
    void checkAuth();
  }, [router]);

  if (!mounted || loading) {
    return <DashboardSkeleton />;
  }

  return <DashboardFeature />;
}
