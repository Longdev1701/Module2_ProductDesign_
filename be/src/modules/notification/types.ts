import { NotificationType } from '@prisma/client';

export interface NotificationItemDTO {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface NotificationListDTO {
  notifications: NotificationItemDTO[];
  unreadCount: number;
  total: number;
}
