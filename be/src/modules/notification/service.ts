import { prisma } from '../../lib/prisma';
import { NotificationType } from '@prisma/client';
import { NotificationListDTO, NotificationItemDTO } from './types';
import { ListNotificationsQuery } from './schema';

export class NotificationService {
  /**
   * 1. Lấy danh sách Thông báo của Người dùng
   */
  static async getNotifications(
    userId: string,
    orgId: string | undefined,
    query: ListNotificationsQuery
  ): Promise<NotificationListDTO> {
    // Tự động đồng bộ thông báo từ Cảnh báo pháp lý GACC & Trạng thái lô hàng nếu chưa có đủ
    const existingCount = await prisma.notification.count({ where: { userId } });

    if (existingCount === 0) {
      // 1. Lấy các cập nhật pháp lý khẩn cấp gần nhất từ GACC/BVTV
      const recentLegalUpdates = await prisma.legalUpdate.findMany({
        where: {
          reviewStatus: 'PUBLISHED',
          severity: { in: ['CRITICAL', 'HIGH'] },
          OR: [{ organizationId: null }, ...(orgId ? [{ organizationId: orgId }] : [])],
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
      });

      for (const update of recentLegalUpdates) {
        await prisma.notification.create({
          data: {
            userId,
            type: update.severity === 'CRITICAL' ? NotificationType.RISK_ALERT : NotificationType.REGULATION_UPDATE,
            title: `Cảnh báo Hải quan: ${update.titleVi}`,
            message: update.summaryVi || 'Có quy định mới áp dụng cho sầu riêng xuất khẩu.',
            isRead: false,
            link: `/regulations?search=${encodeURIComponent(update.titleVi.substring(0, 20))}`,
            createdAt: update.publishedAt || update.createdAt,
          },
        });
      }

      // 2. Lấy thông báo về lô hàng cần xử lý nếu có tổ chức
      if (orgId) {
        const actionRequiredBatch = await prisma.batch.findFirst({
          where: {
            product: { organizationId: orgId },
            status: { in: ['ACTION_REQUIRED', 'READY_FOR_CHECK', 'COMPLIANT'] },
          },
          include: { product: true },
          orderBy: { updatedAt: 'desc' },
        });

        if (actionRequiredBatch) {
          if (actionRequiredBatch.status === 'COMPLIANT') {
            await prisma.notification.create({
              data: {
                userId,
                type: NotificationType.CHECK_COMPLETED,
                title: `Lô ${actionRequiredBatch.batchCode} Đã Đạt Chuẩn GACC`,
                message: `Hồ sơ xuất khẩu Lô ${actionRequiredBatch.batchCode} (${actionRequiredBatch.product.name}) đã hoàn tất thẩm định an toàn 4 Khóa.`,
                isRead: false,
                link: `/reports/${actionRequiredBatch.id}`,
              },
            });
          } else {
            await prisma.notification.create({
              data: {
                userId,
                type: NotificationType.SYSTEM,
                title: `Lô ${actionRequiredBatch.batchCode} Cần Bổ Sung Chứng Từ`,
                message: `Vui lòng nạp đủ 4 Khóa chứng thư (Lab Cadmium, Phyto, C/O, Packing list) trước ngày đóng container.`,
                isRead: false,
                link: `/products`,
              },
            });
          }
        }
      }
    }

    const whereCondition: any = { userId };
    if (query.unreadOnly) {
      whereCondition.isRead = false;
    }

    const [rawList, unreadCount, total] = await Promise.all([
      prisma.notification.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        take: query.limit,
      }),
      prisma.notification.count({
        where: { userId, isRead: false },
      }),
      prisma.notification.count({
        where: { userId },
      }),
    ]);

    const notifications: NotificationItemDTO[] = rawList.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      isRead: n.isRead,
      link: n.link,
      createdAt: n.createdAt.toISOString(),
    }));

    return {
      notifications,
      unreadCount,
      total,
    };
  }

  /**
   * 2. Đánh dấu 1 Thông báo là đã đọc
   */
  static async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    await prisma.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
    return true;
  }

  /**
   * 3. Đánh dấu Tất cả Thông báo là đã đọc
   */
  static async markAllAsRead(userId: string): Promise<boolean> {
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return true;
  }
}
