import { z } from 'zod';

export const listNotificationsSchema = z.object({
  unreadOnly: z.enum(['true', 'false']).optional().transform((v) => v === 'true'),
  limit: z.coerce.number().int().positive().max(50).default(20),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsSchema>;
