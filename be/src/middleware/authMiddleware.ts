import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { prisma } from '../lib/prisma';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization Bearer token is missing',
          requestId: req.requestId ?? '',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
          requestId: req.requestId ?? '',
        },
      });
    }

    // Query Profile to attach PlatformRole
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { platformRole: true },
    });

    // Attach verified user context
    req.user = {
      id: user.id, // token.sub from Supabase Auth
      email: user.email || '',
      platformRole: profile?.platformRole || 'USER',
    };

    return next();
  } catch (_error: unknown) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed',
        requestId: req.requestId ?? '',
      },
    });
  }
}
