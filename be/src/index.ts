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
app.use(express.json({ limit: '10mb' }));

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
import adminRouter from './modules/admin/router';
import { adminLegalUpdatesRouter, legalUpdatesRouter } from './modules/legal-updates/router';
import productRouter from './modules/products/router';
import batchRouter from './modules/batches/router';
import documentRouter from './modules/documents/router';
import reportRouter from './modules/reports/router';
import integrityRouter from './modules/integrity/router';
import dashboardRouter from './modules/dashboard/router';
import { initLegalSyncCron } from './jobs/legal-sync/cron';

// ─── API Routes ─────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/organizations', orgRouter);
app.use('/api/legal-updates', legalUpdatesRouter);
app.use('/api/admin/legal-updates', adminLegalUpdatesRouter);
app.use('/api/admin/regulations/sync', adminLegalUpdatesRouter);
app.use('/api/admin', adminRouter);

// ─── Domain Modules (Senior Backend SRP Architecture) ───
app.use('/api/products', productRouter);
app.use('/api/batches', batchRouter);
app.use('/api/documents', documentRouter);
app.use('/api/reports', reportRouter);
app.use('/api/integrity', integrityRouter);
app.use('/api/dashboard', dashboardRouter);

app.get('/api', (_req, res) => {
  res.json({
    data: {
      message: 'Themis LexiGuard API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        organizations: '/api/organizations',
        admin: '/api/admin',
        legalUpdates: '/api/legal-updates',
        products: '/api/products',
        batches: '/api/batches',
        documents: '/api/documents',
        reports: '/api/reports',
        integrity: '/api/integrity',
        dashboard: '/api/dashboard',
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
