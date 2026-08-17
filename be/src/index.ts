import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-handler';
import { requestIdMiddleware } from './middleware/request-id-middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────
app.use(requestIdMiddleware);
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));

// ─── Health Check ───────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'themis-lexiguard-api',
    },
    meta: { requestId: _req.requestId ?? '' },
  });
});

import authRouter from './modules/auth/router';
import orgRouter from './modules/organization/router';
import productRouter from './modules/product/router';
import batchRouter from './modules/batch/router';
import documentRouter, { batchDocumentRouter } from './modules/document/router';
import adminRouter from './modules/admin/router';
import dashboardRouter from './modules/dashboard/router';
import reportRouter from './modules/report/router';
import { integrityRouter } from './modules/integrity/router';
import { adminLegalUpdatesRouter, legalUpdatesRouter } from './modules/legal-updates/router';
import { initLegalSyncCron } from './jobs/legal-sync/cron';

// ─── API Routes ─────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/organizations', orgRouter);
app.use('/api/products', productRouter);
app.use('/api/batches/:batchId/documents', batchDocumentRouter);
app.use('/api/batches', batchRouter);
app.use('/api/documents', documentRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/reports', reportRouter);
app.use('/api/integrity', integrityRouter);
app.use('/api/legal-updates', legalUpdatesRouter);
app.use('/api/admin/legal-updates', adminLegalUpdatesRouter);
app.use('/api/admin/regulations/sync', adminLegalUpdatesRouter);
app.use('/api/admin', adminRouter);

app.get('/api', (_req, res) => {
  res.json({
    data: {
      message: 'Themis LexiGuard API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        organizations: '/api/organizations',
        products: '/api/products',
        batches: '/api/batches',
        documents: '/api/documents',
        admin: '/api/admin',
        legalUpdates: '/api/legal-updates',
        adminLegalUpdates: '/api/admin/legal-updates',
      },
    },
    meta: { requestId: _req.requestId ?? '' },
  });
});

// ─── 404 Handler ────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
      requestId: req.requestId ?? '',
    },
  });
});

// ─── Error Handler ──────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Themis LexiGuard API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  initLegalSyncCron();
});


export default app;
