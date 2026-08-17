export interface DashboardSummaryDTO {
  totalBatches: number;
  readyForCheckBatches: number;
  actionRequiredBatches: number;
  compliantBatches: number;
  complianceRate: number; // percentage, e.g., 85.5
  criticalLegalAlerts: number;
  totalExportVolumeTons: number;
  readyVolumeTons: number;
  pendingVolumeTons: number;
  readyContainersEstimate: number;
  readyValueVndBillion: number; // Tiền hàng đã sẵn sàng thông quan (Tỷ VNĐ)
  pendingValueVndBillion: number; // Tiền hàng đang bị tắc nghẽn hồ sơ (Tỷ VNĐ)
  totalValueVndBillion: number; // Tổng giá trị hàng hóa (Tỷ VNĐ)
}

export interface DashboardBatchDocSummary {
  id: string;
  title: string;
  fileUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
}

export interface DashboardRecentBatchDTO {
  id: string;
  batchCode: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unit: string;
  status: string;
  hasPhyto: boolean;
  hasLabReport: boolean;
  hasCO: boolean;
  hasPackingList: boolean;
  isReadyForCheck: boolean;
  documentCount: number;
  phytoDoc?: DashboardBatchDocSummary;
  labReportDoc?: DashboardBatchDocSummary;
  coDoc?: DashboardBatchDocSummary;
  packingListDoc?: DashboardBatchDocSummary;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardActionItemDTO {
  id: string;
  batchId?: string;
  batchCode?: string;
  reportId?: string;
  type:
    | 'MISSING_DOCUMENT'
    | 'READY_FOR_CHECK'
    | 'CRITICAL_ALERT'
    | 'EXPIRING_BATCH'
    | 'CADMIUM_NEAR_LIMIT'
    | 'EXPIRING_PHYTO_WINDOW';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  description: string;
  actionLabel: string;
  actionUrl: string;
  createdAt: string;
}

export interface MonthlyTrendItem {
  month: string; // e.g., "05/2024"
  totalBatches: number;
  compliantBatches: number;
  totalVolumeTons: number;
  complianceRate: number;
}

export interface DashboardTrendsDTO {
  monthlyTrends: MonthlyTrendItem[];
  statusBreakdown: {
    status: string;
    count: number;
    labelVi: string;
  }[];
}

export interface DashboardOverviewDTO {
  summary: DashboardSummaryDTO;
  recentBatches: DashboardRecentBatchDTO[];
  actionItems: DashboardActionItemDTO[];
  trends: DashboardTrendsDTO;
}
