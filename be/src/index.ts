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
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, postman) or localhost origins
    if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
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
        products: '/api/products',
        batches: '/api/batches',
        documents: '/api/documents',
        reports: '/api/reports',
        integrity: '/api/integrity',
        dashboard: '/api/dashboard',
        admin: '/api/admin',
        legalUpdates: '/api/legal-updates',
      },
    },
    meta: { requestId: _req.requestId ?? '' },
  });
});

// Init cron job in production/development
initLegalSyncCron();

// ─── Global Error Handler ──────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Themis LexiGuard API Server running on port ${PORT}`);
});

export default app;
