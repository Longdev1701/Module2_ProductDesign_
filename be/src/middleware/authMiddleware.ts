import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';
import { prisma } from '../lib/prisma';
import { cacheService } from '../services/cacheService';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization Bearer token is missing',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    const cacheKey = `auth_token_${token}`;

    // Fast Path: Check memory cache first (0ms latency)
    const cachedUser = cacheService.get<{ id: string; email: string; platformRole: any }>(cacheKey);
    if (cachedUser) {
      req.user = cachedUser;
      return next();
    }

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token',
        },
      });
    }

    // Query Profile to attach PlatformRole
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { platformRole: true },
    });

    const userContext = {
      id: user.id, // token.sub from Supabase Auth
      email: user.email || '',
      platformRole: profile?.platformRole || ('USER' as const),
    };

    // Cache verified user context for 45s
    cacheService.set(cacheKey, userContext, 45);

    req.user = userContext;
    return next();
  } catch (err: any) {
    return res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication failed',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
    });
  }
}
