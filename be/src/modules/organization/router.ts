import { Router } from 'express';
import { OrganizationController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';
import { rbacMiddleware } from '../../middleware/rbacMiddleware';

const orgRouter = Router();

// Protected routes (Requires Auth)
orgRouter.use(authMiddleware);

orgRouter.post('/', OrganizationController.createOrganization); // Onboarding
orgRouter.get('/my', OrganizationController.getMyOrganizations);
orgRouter.post('/join', OrganizationController.joinOrganization);

orgRouter.get('/:id', orgMiddleware('id'), rbacMiddleware('dashboard.view'), OrganizationController.getOrganizationDetails);
orgRouter.patch('/:id', orgMiddleware('id'), rbacMiddleware('org.manage'), OrganizationController.updateOrganization);
orgRouter.post('/:id/invitations', orgMiddleware('id'), rbacMiddleware('member.invite'), OrganizationController.inviteMember);
orgRouter.patch('/:id/members/:memberId', orgMiddleware('id'), rbacMiddleware('member.role_change'), OrganizationController.updateMemberRole);
orgRouter.delete('/:id/members/:memberId', orgMiddleware('id'), rbacMiddleware('member.role_change'), OrganizationController.removeMember);

export default orgRouter;

