/**
 * Strict TypeScript types for Themis LexiGuard Mobile
 * Following technical.md best practices
 */

export type LoadingStatus = 'idle' | 'loading' | 'error' | 'success';

export interface MobileKpiSummary {
  totalBatches: number;
  readyVolumeTons: number;
  readyContainersEstimate: number;
  readyValueBillionVnd: number;
  cadmiumAlertCount: number;
  phytoExpiringCount: number;
}

export interface MobileBatchItem {
  id: string;
  batchCode: string;
  quantity: number;
  unit: string;
  status: string;
  productName: string;
  ciferCode: string;
  phcCode: string;
  pucCode: string;
  cadmiumMgKg?: number;
  phytoExpiryDays?: number;
  sealCode?: string;
  sha256Hash?: string;
}

export interface RegulationItem {
  id: string;
  title: string;
  description: string;
  issuedDate: string;
  authority: string;
}

export interface DocumentCheckState {
  phyto: boolean;
  lab: boolean;
  co: boolean;
  packing: boolean;
}
