export type PlatformRole = "USER" | "SUPPORT" | "PLATFORM_ADMIN" | "SUPER_ADMIN";

export type OrganizationRole = "OWNER" | "MANAGER" | "COMPLIANCE" | "VIEWER";

export interface ApiResponse<T = unknown> {
  data: T;
  meta?: {
    requestId?: string;
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  jobTitle?: string | null;
  platformRole?: PlatformRole;
  createdAt?: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  role?: OrganizationRole;
  taxCode?: string | null;
  address?: string | null;
  legalRepresentative?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  primaryProduct?: string | null;
  exportMarkets?: string[] | null;
  members?: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  role: OrganizationRole;
  status: string;
  profile?: UserProfile;
}

export interface AuthMeResponse {
  user?: UserProfile;
  profile?: UserProfile;
  organizations?: OrganizationSummary[];
}

export interface LoginResponse {
  user: UserProfile;
  organizations: OrganizationSummary[];
  session: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  };
}

export interface RegisterResponse {
  user: UserProfile;
}

export interface MessageResponse {
  message: string;
}

export interface AdminOrganizationInput {
  name: string;
  taxCode?: string;
  address?: string;
  legalRepresentative?: string;
  contactEmail?: string;
  contactPhone?: string;
  primaryProduct?: string;
  exportMarkets?: string[];
}

export interface AdminUser extends UserProfile {
  organizations?: Array<{
    id: string;
    name: string;
    role: OrganizationRole;
  }>;
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}
