import { z } from 'zod';

// Mirrors the current Prisma Regulation model returned by GET /api/regulations.
export const regulationSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.enum([
    'MRL',
    'LABELING',
    'PACKAGING',
    'TRACEABILITY',
    'EUDR',
    'ESG',
    'FOOD_SAFETY',
    'OTHER',
  ]),
  market: z.string(),
  effectiveDate: z.string().nullable(),
  sourceUrl: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
});

export const legalUpdatesResponseSchema = z.object({
  data: z.array(regulationSchema),
  meta: z.object({ requestId: z.string() }),
});

export type Regulation = z.infer<typeof regulationSchema>;
