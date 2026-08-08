import { Router } from 'express';
import { AdminController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { platformRbacMiddleware } from '../../middleware/rbacMiddleware';

const adminRouter = Router();

// Strictly enforce Platform Admin authorization boundary server-side
adminRouter.use(authMiddleware);
adminRouter.use(platformRbacMiddleware(['SUPER_ADMIN', 'PLATFORM_ADMIN']));

adminRouter.post('/organizations', AdminController.createOrganization);
adminRouter.post('/organizations/:id/assign-member', AdminController.assignMember);
adminRouter.get('/organizations', AdminController.getAllOrganizations);
adminRouter.get('/users', AdminController.getAllUsers);

export default adminRouter;
