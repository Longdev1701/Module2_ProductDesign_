/**
 * Themis LexiGuard Mobile — API Client
 * Kết nối trực tiếp tới Express Backend REST API
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

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

export async function fetchMobileSummary(): Promise<MobileKpiSummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`);
    const json = await res.json();
    return json.data || {
      totalBatches: 12,
      readyVolumeTons: 54.2,
      readyContainersEstimate: 2.7,
      readyValueBillionVnd: 6.5,
      cadmiumAlertCount: 1,
      phytoExpiringCount: 2,
    };
  } catch {
    return {
      totalBatches: 12,
      readyVolumeTons: 54.2,
      readyContainersEstimate: 2.7,
      readyValueBillionVnd: 6.5,
      cadmiumAlertCount: 1,
      phytoExpiringCount: 2,
    };
  }
}

export async function fetchMobileBatches(): Promise<MobileBatchItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/batches`);
    const json = await res.json();
    return json.data || [];
  } catch {
    return [
      {
        id: '1',
        batchCode: 'DURIAN-2024-889',
        quantity: 20.5,
        unit: 'tấn',
        status: 'READY_FOR_CHECK',
        productName: 'Sầu riêng Monthong Dona (Cơm Vàng Xuất Khẩu)',
        ciferCode: 'CVNM2401240001',
        phcCode: 'VN-TGPH-0012',
        pucCode: 'VN-TGOR-0095',
        cadmiumMgKg: 0.042,
        phytoExpiryDays: 3,
        sealCode: 'SEAL-GACC-99821',
        sha256Hash: 'a8f3b4c...99d12e',
      },
      {
        id: '2',
        batchCode: 'DURIAN-2024-912',
        quantity: 18.0,
        unit: 'tấn',
        status: 'COLLECTING_DOCUMENTS',
        productName: 'Sầu riêng Ri6 (Loại 1 Hàng Đẹp)',
        ciferCode: 'CVNM2401240001',
        phcCode: 'VN-TGPH-0012',
        pucCode: 'VN-TGOR-0095',
        cadmiumMgKg: 0.021,
        phytoExpiryDays: 11,
      },
    ];
  }
}
