import { Router } from 'express';
import { AdminController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { platformRbacMiddleware } from '../../middleware/rbacMiddleware';
import { CiferController } from './cifer.controller';

const adminRouter = Router();

// Webhook for Python Crawler (Secured by API Key, no JWT required)
adminRouter.post('/cifer/sync', CiferController.sync);

// Strictly enforce Platform Admin authorization boundary server-side
adminRouter.use(authMiddleware);
adminRouter.use(platformRbacMiddleware(['SUPER_ADMIN', 'PLATFORM_ADMIN']));

// 1. Overview
adminRouter.get('/overview', AdminController.getOverview);

// 2. Organizations
adminRouter.get('/organizations', AdminController.getAllOrganizations);
adminRouter.post('/organizations', AdminController.createOrganization);
adminRouter.patch('/organizations/:id', AdminController.updateOrganization);
adminRouter.delete('/organizations/:id', AdminController.deleteOrganization);
adminRouter.post('/organizations/:id/assign-member', AdminController.assignMember);
adminRouter.delete('/organizations/:id/members/:userId', AdminController.removeMember);

// 3. Users & RBAC
adminRouter.get('/users', AdminController.getAllUsers);
adminRouter.patch('/users/:id/platform-role', AdminController.changeUserPlatformRole);

// 4. Legal Sync Center
adminRouter.get('/legal-sync/stats', AdminController.getLegalSyncStats);
adminRouter.post('/legal-sync/trigger', AdminController.triggerLegalSync);

// 5. CIFER China Registry
adminRouter.get('/cifer', AdminController.getCiferRegistries);

// 6. System Audit Logs
adminRouter.get('/audit-logs', AdminController.getAuditLogs);

export default adminRouter;
