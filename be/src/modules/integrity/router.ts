import { Router } from 'express';
import { IntegrityController } from './controller';
import { authMiddleware } from '../../middleware/authMiddleware';
import { orgMiddleware } from '../../middleware/orgMiddleware';

const router = Router();

// Public endpoint để Hải quan, Đối tác mua tra cứu mã băm SHA-256 từ Báo cáo (Không cần login)
router.get('/verify/:hash', IntegrityController.verifyHash);

// Protected endpoints yêu cầu Đăng nhập & Xác thực Tổ chức
router.use(authMiddleware);
router.use(orgMiddleware());

router.get('/stats', IntegrityController.getStats);
router.get('/logs', IntegrityController.listLogs);

export const integrityRouter = router;
export default router;
