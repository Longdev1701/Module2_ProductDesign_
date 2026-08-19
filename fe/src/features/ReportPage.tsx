"use client";

import { useParams, useSearchParams } from 'next/navigation';
import { ReportFeature } from './reports';

export default function ReportPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  // Lấy ID từ URL params (/reports/[id]) hoặc query param (?batch=...)
  const idFromParam = typeof params?.id === 'string' ? params.id : '';
  const batchFromQuery = searchParams?.get('batch') || '';

  const targetId = idFromParam || batchFromQuery;

  return <ReportFeature reportIdOrBatchId={targetId} />;
}
