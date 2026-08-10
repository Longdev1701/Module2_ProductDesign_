import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LegalUpdate,
  LegalUpdateCategory,
  LegalUpdateConfidence,
  LegalUpdateRelevance,
  LegalUpdateReviewStatus,
  LegalUpdateSeverity,
  LegalUpdateStatus,
  Prisma,
} from '@prisma/client';
import { prisma } from '../../lib/prisma';
import { ApiError } from '../../lib/api-error';
import { createLegalUpdateSchema, feedQuerySchema, publishLegalUpdateSchema } from './schema';
import { LegalUpdatesService } from './service';

type LegalUpdateDelegate = {
  count: (args: unknown) => Promise<number>;
  findMany: (args: unknown) => Promise<LegalUpdate[]>;
  findFirst: (args: unknown) => Promise<LegalUpdate | null>;
  findUnique: (args: unknown) => Promise<LegalUpdate | null>;
  findUniqueOrThrow: (args: unknown) => Promise<LegalUpdate>;
  create: (args: unknown) => Promise<LegalUpdate>;
  update: (args: unknown) => Promise<LegalUpdate>;
  updateMany: (args: unknown) => Promise<{ count: number }>;
};

type MutablePrisma = {
  legalUpdate: LegalUpdateDelegate;
  organization: { findUnique: (args: unknown) => Promise<{ id: string } | null> };
  auditLog: { create: (args: unknown) => Promise<unknown> };
  $transaction: (input: unknown) => Promise<unknown>;
};

function makeLegalUpdate(overrides: Partial<LegalUpdate> = {}): LegalUpdate {
  const now = new Date('2026-08-10T00:00:00.000Z');
  return {
    id: '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111',
    organizationId: null,
    regulationId: null,
    sourceAgency: 'GACC',
    sourceCountry: 'CHINA',
    sourceUrl: 'https://example.com/legal-update',
    documentUrl: null,
    sourceReference: 'GACC_TEST_001',
    sourceLanguage: 'zh',
    rawArticleId: null,
    checksum: 'a'.repeat(64),
    titleOriginal: '测试',
    titleVi: 'Tin pháp lý thử nghiệm',
    frontendTitleVi: 'Tin thử nghiệm',
    frontendSummaryVi: 'Tóm tắt ngắn',
    summaryVi: 'Tóm tắt chi tiết',
    detailedSummaryVi: null,
    businessImpactVi: null,
    recommendedActions: [],
    citations: [],
    market: 'CHINA',
    category: LegalUpdateCategory.PHYTOSANITARY,
    severity: LegalUpdateSeverity.HIGH,
    status: LegalUpdateStatus.EFFECTIVE,
    relevanceStatus: LegalUpdateRelevance.RELEVANT,
    relevanceReasonVi: 'Liên quan sầu riêng',
    affectedProducts: [],
    affectedGroups: ['trái cây tươi'],
    hsCodes: ['0810.60.00'],
    confidence: LegalUpdateConfidence.HIGH,
    publishedAt: now,
    effectiveAt: now,
    reviewStatus: LegalUpdateReviewStatus.PENDING_REVIEW,
    reviewedByUserId: null,
    reviewedAt: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function installPrismaStub(record: LegalUpdate) {
  const mutablePrisma = prisma as unknown as MutablePrisma;
  const original = {
    legalUpdate: mutablePrisma.legalUpdate,
    organization: mutablePrisma.organization,
    auditLog: mutablePrisma.auditLog,
    transaction: mutablePrisma.$transaction,
  };
  const auditEntries: unknown[] = [];
  let currentRecord = record;
  let latestFeedArgs: unknown;
  let latestCreateArgs: unknown;

  const delegate: LegalUpdateDelegate = {
    count: async () => 1,
    findMany: async (args) => {
      latestFeedArgs = args;
      return [currentRecord];
    },
    findFirst: async () => currentRecord.reviewStatus === LegalUpdateReviewStatus.PUBLISHED ? currentRecord : null,
    findUnique: async () => currentRecord,
    findUniqueOrThrow: async () => currentRecord,
    create: async (args) => {
      latestCreateArgs = args;
      return currentRecord;
    },
    update: async (args) => {
      const data = (args as { data: Partial<LegalUpdate> }).data;
      currentRecord = { ...currentRecord, ...data };
      return currentRecord;
    },
    updateMany: async (args) => {
      const { where, data } = args as {
        where: Partial<LegalUpdate>;
        data: Partial<LegalUpdate>;
      };
      const matchesStatus = where.reviewStatus === undefined || where.reviewStatus === currentRecord.reviewStatus;
      const matchesUpdatedAt = where.updatedAt === undefined
        || where.updatedAt.getTime() === currentRecord.updatedAt.getTime();
      if (where.id !== currentRecord.id || !matchesStatus || !matchesUpdatedAt) {
        return { count: 0 };
      }
      currentRecord = { ...currentRecord, ...data };
      return { count: 1 };
    },
  };

  mutablePrisma.legalUpdate = delegate;
  mutablePrisma.organization = { findUnique: async () => null };
  mutablePrisma.auditLog = { create: async (args) => { auditEntries.push(args); return args; } };
  mutablePrisma.$transaction = async (input) => {
    if (Array.isArray(input)) return Promise.all(input as Promise<unknown>[]);
    if (typeof input === 'function') {
      return (input as (tx: MutablePrisma) => Promise<unknown>)(mutablePrisma);
    }
    throw new Error('Unsupported transaction input');
  };

  return {
    auditEntries,
    getLatestCreateArgs: () => latestCreateArgs,
    getLatestFeedArgs: () => latestFeedArgs,
    restore: () => {
      mutablePrisma.legalUpdate = original.legalUpdate;
      mutablePrisma.organization = original.organization;
      mutablePrisma.auditLog = original.auditLog;
      mutablePrisma.$transaction = original.transaction;
    },
  };
}

test('create schema rejects client supplied review metadata', () => {
  const result = createLegalUpdateSchema.safeParse({
    sourceAgency: 'GACC',
    sourceUrl: 'https://example.com/article',
    titleVi: 'Tiêu đề',
    summaryVi: 'Tóm tắt',
    market: 'CHINA',
    reviewedByUserId: '17eb2551-77ab-4bf0-ab1c-b2a3f0f22222',
  });

  assert.equal(result.success, false);
});

test('create schema only accepts well-formed http and https source URLs', () => {
  for (const sourceUrl of [
    'javascript:alert(1)',
    'data:text/html,unsafe',
    'file:///tmp/legal-update',
    'not-a-url',
    '',
  ]) {
    const result = createLegalUpdateSchema.safeParse({
      sourceAgency: 'GACC',
      sourceUrl,
      titleVi: 'Tiêu đề',
      summaryVi: 'Tóm tắt',
      market: 'CHINA',
    });
    assert.equal(result.success, false);
  }
});

test('feed query rejects page sizes above the server-side limit', () => {
  const result = feedQuerySchema.safeParse({ page: 1, pageSize: 101 });
  assert.equal(result.success, false);
});

test('publish accepts an omitted request body', () => {
  const result = publishLegalUpdateSchema.safeParse(undefined);
  assert.equal(result.success, true);
});

test('feed is constrained to published global or current organization records', async () => {
  const stub = installPrismaStub(makeLegalUpdate({ reviewStatus: LegalUpdateReviewStatus.PUBLISHED }));
  try {
    const result = await LegalUpdatesService.getFeed('17eb2551-77ab-4bf0-ab1c-b2a3f0f33333', {
      page: 1,
      pageSize: 3,
      sort: 'publishedAt:desc',
    });
    const args = stub.getLatestFeedArgs() as { where: { AND: Array<Record<string, unknown>> } };

    assert.equal(result.data[0].title, 'Tin thử nghiệm');
    assert.deepEqual(args.where.AND[0], { reviewStatus: LegalUpdateReviewStatus.PUBLISHED });
    assert.deepEqual(args.where.AND[1], {
      OR: [
        { organizationId: null },
        { organizationId: '17eb2551-77ab-4bf0-ab1c-b2a3f0f33333' },
      ],
    });
  } finally {
    stub.restore();
  }
});

test('feed severity sorting places critical updates before informational updates', async () => {
  const stub = installPrismaStub(makeLegalUpdate({ reviewStatus: LegalUpdateReviewStatus.PUBLISHED }));
  try {
    await LegalUpdatesService.getFeed('17eb2551-77ab-4bf0-ab1c-b2a3f0f33333', {
      page: 1,
      pageSize: 3,
      sort: 'severity:desc',
    });
    const args = stub.getLatestFeedArgs() as { orderBy: unknown };
    assert.deepEqual(args.orderBy, { severity: 'asc' });
  } finally {
    stub.restore();
  }
});

test('feed date sorting keeps undated updates at the end', async () => {
  const stub = installPrismaStub(makeLegalUpdate({ reviewStatus: LegalUpdateReviewStatus.PUBLISHED }));
  try {
    await LegalUpdatesService.getFeed('17eb2551-77ab-4bf0-ab1c-b2a3f0f33333', {
      page: 1,
      pageSize: 3,
      sort: 'publishedAt:desc',
    });
    const args = stub.getLatestFeedArgs() as { orderBy: unknown };
    assert.deepEqual(args.orderBy, { publishedAt: { sort: 'desc', nulls: 'last' } });
  } finally {
    stub.restore();
  }
});

test('create always persists pending review and writes an audit entry', async () => {
  const stub = installPrismaStub(makeLegalUpdate());
  try {
    await LegalUpdatesService.create('17eb2551-77ab-4bf0-ab1c-b2a3f0f44444', {
      sourceAgency: 'GACC',
      sourceUrl: 'https://example.com/article',
      titleVi: 'Tiêu đề',
      summaryVi: 'Tóm tắt',
      market: 'CHINA',
    });
    const createArgs = stub.getLatestCreateArgs() as { data: { reviewStatus: LegalUpdateReviewStatus } };
    const audit = stub.auditEntries[0] as { data: { action: string; userId: string } };

    assert.equal(createArgs.data.reviewStatus, LegalUpdateReviewStatus.PENDING_REVIEW);
    assert.equal(audit.data.action, 'legal_update.created');
    assert.equal(audit.data.userId, '17eb2551-77ab-4bf0-ab1c-b2a3f0f44444');
  } finally {
    stub.restore();
  }
});

test('publish records reviewer from the authenticated actor and audit log', async () => {
  const stub = installPrismaStub(makeLegalUpdate());
  try {
    const actorId = '17eb2551-77ab-4bf0-ab1c-b2a3f0f55555';
    const result = await LegalUpdatesService.publish(actorId, '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111');
    const audit = stub.auditEntries[0] as { data: { action: string; userId: string } };

    assert.equal(result.reviewStatus, 'published');
    assert.equal(result.relevance.status, 'relevant');
    assert.equal(audit.data.action, 'legal_update.published');
    assert.equal(audit.data.userId, actorId);
  } finally {
    stub.restore();
  }
});

test('publish rejects an update without a publication date', async () => {
  const stub = installPrismaStub(makeLegalUpdate({ publishedAt: null }));
  try {
    await assert.rejects(
      LegalUpdatesService.publish('17eb2551-77ab-4bf0-ab1c-b2a3f0f55555', '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111'),
      (error: unknown) => error instanceof ApiError && error.status === 409,
    );
  } finally {
    stub.restore();
  }
});

test('concurrent publish attempts do not overwrite the first reviewer', async () => {
  const stub = installPrismaStub(makeLegalUpdate());
  try {
    const updateId = '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111';
    const results = await Promise.allSettled([
      LegalUpdatesService.publish('17eb2551-77ab-4bf0-ab1c-b2a3f0f55555', updateId),
      LegalUpdatesService.publish('17eb2551-77ab-4bf0-ab1c-b2a3f0f66666', updateId),
    ]);

    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
    assert.equal(results.filter((result) => result.status === 'rejected').length, 1);
    const rejection = results.find((result) => result.status === 'rejected');
    assert.ok(rejection?.status === 'rejected' && rejection.reason instanceof ApiError);
    assert.equal(rejection.reason.status, 409);
  } finally {
    stub.restore();
  }
});

test('concurrent publish and reject requests cannot create conflicting audit history', async () => {
  const stub = installPrismaStub(makeLegalUpdate());
  try {
    const updateId = '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111';
    const results = await Promise.allSettled([
      LegalUpdatesService.publish('17eb2551-77ab-4bf0-ab1c-b2a3f0f55555', updateId),
      LegalUpdatesService.reject('17eb2551-77ab-4bf0-ab1c-b2a3f0f66666', updateId, 'Thiếu căn cứ nguồn'),
    ]);

    assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1);
    assert.equal(results.filter((result) => result.status === 'rejected').length, 1);
    assert.equal(stub.auditEntries.length, 1);
  } finally {
    stub.restore();
  }
});

test('update audit stores the full before and after business snapshots', async () => {
  const stub = installPrismaStub(makeLegalUpdate());
  try {
    await LegalUpdatesService.update(
      '17eb2551-77ab-4bf0-ab1c-b2a3f0f44444',
      '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111',
      { summaryVi: 'Tóm tắt đã được hiệu chỉnh' },
    );
    const audit = stub.auditEntries[0] as {
      data: { metadata: { before: { summaryVi: string }; after: { summaryVi: string } } };
    };

    assert.equal(audit.data.metadata.before.summaryVi, 'Tóm tắt chi tiết');
    assert.equal(audit.data.metadata.after.summaryVi, 'Tóm tắt đã được hiệu chỉnh');
  } finally {
    stub.restore();
  }
});

test('published update only permits lifecycle status or effective date changes', async () => {
  const stub = installPrismaStub(makeLegalUpdate({ reviewStatus: LegalUpdateReviewStatus.PUBLISHED }));
  try {
    await LegalUpdatesService.update(
      '17eb2551-77ab-4bf0-ab1c-b2a3f0f44444',
      '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111',
      { status: 'amended' },
    );
    await assert.rejects(
      LegalUpdatesService.update(
        '17eb2551-77ab-4bf0-ab1c-b2a3f0f44444',
        '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111',
        { summaryVi: 'Không được phép sửa nội dung đã duyệt' },
      ),
      (error: unknown) => error instanceof ApiError && error.status === 409,
    );
  } finally {
    stub.restore();
  }
});

test('detail does not expose pending or rejected updates', async () => {
  const stub = installPrismaStub(makeLegalUpdate({ reviewStatus: LegalUpdateReviewStatus.PENDING_REVIEW }));
  try {
    await assert.rejects(
      LegalUpdatesService.getPublishedDetail('17eb2551-77ab-4bf0-ab1c-b2a3f0f33333', '17eb2551-77ab-4bf0-ab1c-b2a3f0f11111'),
      (error: unknown) => error instanceof ApiError && error.status === 404,
    );
  } finally {
    stub.restore();
  }
});

test('duplicate source and checksum is mapped to a conflict error', async () => {
  const stub = installPrismaStub(makeLegalUpdate());
  const mutablePrisma = prisma as unknown as MutablePrisma;
  mutablePrisma.legalUpdate.create = async () => {
    throw new Prisma.PrismaClientKnownRequestError('Duplicate legal update', {
      code: 'P2002',
      clientVersion: 'test',
    });
  };

  try {
    await assert.rejects(
      LegalUpdatesService.create('17eb2551-77ab-4bf0-ab1c-b2a3f0f44444', {
        sourceAgency: 'GACC',
        sourceUrl: 'https://example.com/article',
        titleVi: 'Tiêu đề',
        summaryVi: 'Tóm tắt',
        market: 'CHINA',
      }),
      (error: unknown) => error instanceof ApiError && error.status === 409 && error.code === 'CONFLICT',
    );
  } finally {
    stub.restore();
  }
});
