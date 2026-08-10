import { Router } from 'express';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';
import { platformRbacMiddleware, rbacMiddleware } from '../../middleware/rbacMiddleware';
import { LegalUpdatesController } from './controller';

export const legalUpdatesRouter = Router();
legalUpdatesRouter.use(authMiddleware, orgMiddleware(), rbacMiddleware('dashboard.view'));
legalUpdatesRouter.get('/feed', LegalUpdatesController.getFeed);
legalUpdatesRouter.get('/:id', LegalUpdatesController.getDetail);

export const adminLegalUpdatesRouter = Router();
adminLegalUpdatesRouter.use(authMiddleware, platformRbacMiddleware(['PLATFORM_ADMIN', 'SUPER_ADMIN']));
adminLegalUpdatesRouter.get('/', LegalUpdatesController.listForAdmin);
adminLegalUpdatesRouter.get('/:id', LegalUpdatesController.getAdminDetail);
adminLegalUpdatesRouter.post('/', LegalUpdatesController.create);
adminLegalUpdatesRouter.patch('/:id', LegalUpdatesController.update);
adminLegalUpdatesRouter.post('/:id/publish', LegalUpdatesController.publish);
adminLegalUpdatesRouter.post('/:id/reject', LegalUpdatesController.reject);
