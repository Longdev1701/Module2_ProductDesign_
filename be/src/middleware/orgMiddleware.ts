import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

export function orgMiddleware(paramName: string = 'orgId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'User authentication required',
          },
        });
      }

      // Read orgId from params, query, or header
      const orgId =
        req.params[paramName] ||
        (req.query.orgId as string) ||
        (req.headers['x-organization-id'] as string) ||
        req.body?.organizationId;

      if (!orgId) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: 'Organization ID is required in route, header x-organization-id, or query',
          },
        });
      }

      const member = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: orgId,
            userId: req.user.id,
          },
        },
      });

      if (!member || member.status !== 'ACTIVE') {
        return res.status(403).json({
          error: {
            code: 'FORBIDDEN',
            message: 'You are not an active member of this organization',
          },
        });
      }

      req.orgMember = {
        id: member.id,
        organizationId: member.organizationId,
        role: member.role,
        status: member.status,
      };

      return next();
    } catch (err: any) {
      return res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to verify organization membership',
        },
      });
    }
  };
}
