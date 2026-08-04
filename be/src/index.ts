import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────────────────────
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
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'themis-lexiguard-api',
  });
});

// ─── API Routes ─────────────────────────────────────────
// TODO: Sprint 1 — Auth routes
// TODO: Sprint 2 — Product & Batch routes
// TODO: Sprint 3 — Document routes
// TODO: Sprint 4 — Regulation routes
// TODO: Sprint 5 — Compliance & AI routes
// TODO: Sprint 6 — Report routes
// TODO: Sprint 7 — Dashboard & Integrity routes

app.get('/api', (_req, res) => {
  res.json({
    message: 'Themis LexiGuard API',
    version: '1.0.0',
    docs: '/api/docs',
  });
});

// ─── 404 Handler ────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// ─── Error Handler ──────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
    },
  });
});

// ─── Start Server ───────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Themis LexiGuard API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});

export default app;
