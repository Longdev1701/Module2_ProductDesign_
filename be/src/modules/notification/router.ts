import { Router, Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { prisma } from '../../lib/prisma';
import { NotificationController } from './controller';

const notificationRouter = Router();

// Yêu cầu xác thực JWT
notificationRouter.use(authMiddleware);

// Tùy chọn nạp thông tin org nếu có
notificationRouter.use(async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const orgId =
      (req.headers['x-organization-id'] as string) ||
      (req.query.orgId as string);

    if (orgId && req.user) {
      const member = await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: orgId,
            userId: req.user.id,
          },
        },
      });
      if (member) {
        req.orgMember = {
          id: member.id,
          organizationId: member.organizationId,
          role: member.role,
          status: member.status,
        };
      }
    }
  } catch {}
  next();
});

notificationRouter.get('/', NotificationController.getNotifications);
notificationRouter.post('/read-all', NotificationController.markAllAsRead);
notificationRouter.patch('/:id/read', NotificationController.markAsRead);

export default notificationRouter;

