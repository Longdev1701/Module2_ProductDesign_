import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';
import { ApiError } from '../../lib/api-error';
import {
  adminListQuerySchema,
  createLegalUpdateSchema,
  feedQuerySchema,
  legalUpdateParamsSchema,
  publishLegalUpdateSchema,
  rejectLegalUpdateSchema,
  updateLegalUpdateSchema,
} from './schema';
import { LegalUpdatesService } from './service';
import { LegalSyncService } from '../../jobs/legal-sync/service';


function sendValidationError(res: Response, requestId: string | undefined, message: string, error: ZodError) {
  return res.status(422).json({
    error: {
      code: 'VALIDATION_ERROR',
      message,
      details: error.flatten(),
      requestId: requestId ?? '',
    },
  });
}

function parseOrRespond<T>(
  schema: ZodType<T>,
  value: unknown,
  res: Response,
  requestId: string | undefined,
  message: string,
): T | undefined {
  const result = schema.safeParse(value);
  if (!result.success) {
    sendValidationError(res, requestId, message, result.error);
    return undefined;
  }
  return result.data;
}

function requireActor(req: Request): string {
  if (!req.user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Chưa đăng nhập');
  }
  return req.user.id;
}

function requireOrganization(req: Request): string {
  if (!req.orgMember) {
    throw new ApiError(403, 'FORBIDDEN', 'Thiếu ngữ cảnh tổ chức');
  }
  return req.orgMember.organizationId;
}

export class LegalUpdatesController {
  static async getFeed(req: Request, res: Response, next: NextFunction) {
    try {
      const query = parseOrRespond(feedQuerySchema, req.query, res, req.requestId, 'Query feed không hợp lệ');
      if (!query) return;
      const result = await LegalUpdatesService.getFeed(requireOrganization(req), query);
      return res.status(200).json({ data: result.data, meta: { ...result.meta, requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const params = parseOrRespond(legalUpdateParamsSchema, req.params, res, req.requestId, 'ID bản tin không hợp lệ');
      if (!params) return;
      const result = await LegalUpdatesService.getPublishedDetail(requireOrganization(req), params.id);
      return res.status(200).json({ data: result, meta: { requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async listForAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const query = parseOrRespond(adminListQuerySchema, req.query, res, req.requestId, 'Query admin không hợp lệ');
      if (!query) return;
      const result = await LegalUpdatesService.listForAdmin(query);
      return res.status(200).json({ data: result.data, meta: { ...result.meta, requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async getAdminDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const params = parseOrRespond(legalUpdateParamsSchema, req.params, res, req.requestId, 'ID bản tin không hợp lệ');
      if (!params) return;
      const result = await LegalUpdatesService.getAdminDetail(params.id);
      return res.status(200).json({ data: result, meta: { requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const input = parseOrRespond(createLegalUpdateSchema, req.body, res, req.requestId, 'Dữ liệu tạo bản tin không hợp lệ');
      if (!input) return;
      const result = await LegalUpdatesService.create(requireActor(req), input, req.ip);
      return res.status(201).json({ data: result, meta: { requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const params = parseOrRespond(legalUpdateParamsSchema, req.params, res, req.requestId, 'ID bản tin không hợp lệ');
      if (!params) return;
      const input = parseOrRespond(updateLegalUpdateSchema, req.body, res, req.requestId, 'Dữ liệu cập nhật bản tin không hợp lệ');
      if (!input) return;
      const result = await LegalUpdatesService.update(requireActor(req), params.id, input, req.ip);
      return res.status(200).json({ data: result, meta: { requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async publish(req: Request, res: Response, next: NextFunction) {
    try {
      const params = parseOrRespond(legalUpdateParamsSchema, req.params, res, req.requestId, 'ID bản tin không hợp lệ');
      if (!params) return;
      const body = parseOrRespond(publishLegalUpdateSchema, req.body ?? {}, res, req.requestId, 'Dữ liệu publish không hợp lệ');
      if (!body) return;
      const result = await LegalUpdatesService.publish(requireActor(req), params.id, req.ip);
      return res.status(200).json({ data: result, meta: { requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const params = parseOrRespond(legalUpdateParamsSchema, req.params, res, req.requestId, 'ID bản tin không hợp lệ');
      if (!params) return;
      const body = parseOrRespond(rejectLegalUpdateSchema, req.body, res, req.requestId, 'Dữ liệu từ chối không hợp lệ');
      if (!body) return;
      const result = await LegalUpdatesService.reject(requireActor(req), params.id, body.reason, req.ip);
      return res.status(200).json({ data: result, meta: { requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }

  static async triggerSync(req: Request, res: Response, next: NextFunction) {
    try {
      const actorId = requireActor(req);
      const summary = await LegalSyncService.runSync(actorId, req.ip);
      return res.status(200).json({ data: summary, meta: { requestId: req.requestId ?? '' } });
    } catch (error: unknown) {
      return next(error);
    }
  }
}

