import { OrganizationRole, PlatformRole } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  platformRole?: PlatformRole;
}

export interface OrganizationMemberContext {
  id: string;
  organizationId: string;
  role: OrganizationRole;
  status: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      orgMember?: OrganizationMemberContext;
      requestId?: string;
    }
  }
}
