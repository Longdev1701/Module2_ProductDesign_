import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './service';
import { listNotificationsSchema } from './schema';

export class NotificationController {
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const orgId = req.orgMember?.organizationId;
      const parsedQuery = listNotificationsSchema.parse(req.query);

      const result = await NotificationService.getNotifications(userId, orgId, parsedQuery);
      return res.json({
        data: result.notifications,
        unreadCount: result.unreadCount,
        total: result.total,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const notificationId = req.params.id;

      await NotificationService.markAsRead(userId, notificationId);
      return res.json({
        data: { success: true },
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      await NotificationService.markAllAsRead(userId);
      return res.json({
        data: { success: true },
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (error) {
      return next(error);
    }
  }
}
