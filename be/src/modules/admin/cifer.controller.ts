import { Request, Response } from 'express';
import { CiferSyncService } from './cifer.service';
import { z } from 'zod';

export class CiferController {
  static async sync(req: Request, res: Response) {
    // Basic API Key check
    const apiKey = req.headers['x-cifer-api-key'];
    const expectedKey = process.env.CIFER_SYNC_API_KEY;

    if (!expectedKey || apiKey !== expectedKey) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Invalid or missing API key',
          requestId: req.requestId ?? '',
        }
      });
    }

    try {
      const { data } = req.body;
      if (!Array.isArray(data)) {
        return res.status(400).json({
          error: {
            code: 'BAD_REQUEST',
            message: 'Invalid payload, expected { data: [...] }',
            requestId: req.requestId ?? '',
          }
        });
      }

      const result = await CiferSyncService.syncRecords(data);

      res.status(200).json({
        data: result,
        meta: { requestId: req.requestId ?? '' },
      });
    } catch (err: any) {
      console.error('[CiferController] Sync error:', err);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: err.message || 'Unknown error',
          requestId: req.requestId ?? '',
        }
      });
    }
  }
}
