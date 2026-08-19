export type PlatformRole = "USER" | "SUPPORT" | "PLATFORM_ADMIN" | "SUPER_ADMIN";

export type OrganizationRole = "OWNER" | "MANAGER" | "COMPLIANCE" | "VIEWER";

export type DocumentType =
  | "CO"
  | "CQ"
  | "PHYTO"
  | "LAB_REPORT"
  | "CONTRACT"
  | "INVOICE"
  | "PACKING_LIST"
  | "GPS_MAP"
  | "OTHER";

export interface GateKeyStatus {
  type: DocumentType;
  shortLabel: string;
  name: string;
  description: string;
  isUploaded: boolean;
  document?: DocumentItem | null;
}

export interface ApiResponse<T = unknown> {
  data: T;
  unreadCount?: number;
  summary?: any;
  meta?: {
    requestId?: string;
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  jobTitle?: string | null;
  platformRole?: PlatformRole;
  createdAt?: string;
}

export interface OrganizationSummary {
  id: string;
  name: string;
  role?: OrganizationRole;
  taxCode?: string | null;
  address?: string | null;
  legalRepresentative?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  primaryProduct?: string | null;
  exportMarkets?: string[] | null;
  exportForm?: string | null;
  exportScale?: string | null;
  createdAt?: string;
  _count?: {
    members: number;
    products: number;
    documents: number;
  };
  members?: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  role: OrganizationRole;
  status: string;
  profile?: UserProfile;
  user?: UserProfile;
  joinedAt?: string;
}

export interface AuthMeResponse {
  user?: UserProfile;
  profile?: UserProfile;
  organizations?: OrganizationSummary[];
}

export interface LoginResponse {
  user: UserProfile;
  organizations: OrganizationSummary[];
  session: {
    accessToken: string;
    refreshToken?: string;
    expiresAt?: number;
  };
}

export interface RegisterResponse {
  user: UserProfile;
}

export interface MessageResponse {
  message: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: DocumentType;
  fileUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentPayload {
  title: string;
  type: DocumentType;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  batchId?: string;
}

export interface BatchDocumentChecklist {
  batchId: string;
  batchCode: string;
  status: BatchStatus;
  isReadyForCheck?: boolean;
  uploadedRequiredCount?: number;
  totalRequired?: number;
  completionRate?: number;
  percentage?: number;
  gates?: GateKeyStatus[];
  otherDocuments?: DocumentItem[];
  documents: DocumentItem[];
}

export interface AdminOrganizationInput {
  name: string;
  taxCode?: string | null;
  address?: string | null;
  legalRepresentative?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  primaryProduct: string;
  exportMarkets: string[];
  exportForm?: string | null;
  exportScale?: string | null;
}

export interface AdminUser extends UserProfile {
  organizations?: Array<{
    orgId: string;
    orgName: string;
    primaryProduct?: string | null;
    role: OrganizationRole;
    status: string;
    joinedAt?: string;
  }>;
}

export interface AdminOverviewData {
  kpis: {
    totalOrgs: number;
    totalUsers: number;
    totalBatches: number;
    totalProducts: number;
    totalRegulations: number;
    totalLegalUpdates: number;
    totalCifer: number;
  };
  recentAuditLogs: Array<{
    id: string;
    action: string;
    entity: string;
    entityId?: string | null;
    createdAt: string;
    ipAddress?: string | null;
    profile?: {
      fullName: string;
      email: string;
      platformRole: string;
    } | null;
  }>;
  orgsByProduct: Array<{
    product: string;
    count: number;
  }>;
  systemStatus: {
    database: string;
    auth: string;
    aiEngine: string;
    crawler: string;
  };
}

export interface AdminLegalSyncStats {
  totalUpdates: number;
  totalRegulations: number;
  marketDistribution: Record<string, number>;
  lastSyncAt: string | null;
  latestScrapedDocument?: {
    titleVi: string;
    sourceAgency: string;
    market: string;
    createdAt: string;
  } | null;
  crawlerStatus: string;
}

export interface AdminCiferRecord {
  id: string;
  no: string;
  country: string;
  category: string;
  chinaRegNo: string;
  overseasRegNo?: string | null;
  name: string;
  address?: string | null;
  regDate?: string | null;
  expDate?: string | null;
  state?: string | null;
  organizationId?: string | null;
  organization?: {
    id: string;
    name: string;
    taxCode?: string | null;
  } | null;
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  metadata?: Record<string, any> | null;
  ipAddress?: string | null;
  createdAt: string;
  profile?: {
    id: string;
    fullName: string;
    email: string;
    platformRole: string;
  } | null;
}

export interface ProductMarketRequirement {
  marketCode: string;
  marketName: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  hsCode: string | null;
  description: string | null;
  origin: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  marketRequirements?: ProductMarketRequirement[];
  batchesCount?: number;
  batches?: BatchItem[];
}

export type BatchStatus =
  | "DRAFT"
  | "COLLECTING_DOCUMENTS"
  | "READY_FOR_CHECK"
  | "CHECKING"
  | "ACTION_REQUIRED"
  | "COMPLIANT"
  | "NON_COMPLIANT"
  | "EXPIRED";

export interface BatchItem {
  id: string;
  batchCode: string;
  productId: string;
  productName?: string;
  productCategory?: string;
  hsCode?: string | null;
  origin?: string | null;
  quantity: number | null;
  unit: string | null;
  status: BatchStatus;
  producedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalBatches: number;
  compliantBatches: number;
  actionRequiredBatches: number;
  checkingBatches: number;
  draftBatches: number;
  readyForCheckBatches?: number;
  complianceRate: number;
  totalVolumeTons?: number;
  totalExportVolumeTons?: number;
  readyVolumeTons: number;
  pendingVolumeTons?: number;
  readyBatchesCount?: number;
  pendingBatchesCount?: number;
  readyContainersEstimate?: number;
  criticalAlertsCount: number;
  criticalLegalAlerts?: number;
  expiringBatchesCount: number;
  totalValueVndBillion?: number;
  readyValueVndBillion?: number;
  pendingValueVndBillion?: number;
}

export interface DashboardBatchDocSummary {
  id: string;
  title: string;
  fileUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
}

export interface DashboardRecentBatch {
  id: string;
  batchCode: string;
  productId?: string;
  productName: string;
  productCategory: string;
  marketName: string;
  quantity: number | null;
  unit: string | null;
  status: BatchStatus;
  producedAt: string | null;
  expiresAt: string | null;
  completedDocsCount: number;
  requiredDocsCount: number;
  hasPhyto?: boolean;
  hasLabReport?: boolean;
  hasCO?: boolean;
  hasPackingList?: boolean;
  isReadyForCheck?: boolean;
  phytoDoc?: DashboardBatchDocSummary;
  labReportDoc?: DashboardBatchDocSummary;
  coDoc?: DashboardBatchDocSummary;
  packingListDoc?: DashboardBatchDocSummary;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardActionItem {
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
  month: string;
  totalBatches: number;
  compliantBatches: number;
  totalVolumeTons: number;
  complianceRate: number;
}

export interface DashboardTrends {
  monthlyTrends: MonthlyTrendItem[];
  statusBreakdown: Array<{
    status: string;
    count: number;
    labelVi: string;
  }>;
}

export interface DashboardOverview {
  summary: DashboardSummary;
  recentBatches: DashboardRecentBatch[];
  actionItems: DashboardActionItem[];
  trends: DashboardTrends;
}

export interface HistoryItem {
  id: string;
  checkId: string;
  batchId: string;
  batchCode: string;
  productId: string;
  productName: string;
  productCategory: string;
  hsCode: string | null;
  origin: string | null;
  market: string;
  quantity: number | null;
  unit: string | null;
  checkStatus: string;
  result:
    | 'COMPLIANT'
    | 'CONDITIONALLY_COMPLIANT'
    | 'NON_COMPLIANT'
    | 'INSUFFICIENT_INFORMATION'
    | 'NOT_APPLICABLE'
    | 'MANUAL_REVIEW_REQUIRED';
  aiConfidence: number | null;
  summary: string | null;
  reportId?: string | null;
  reportStatus?: string | null;
  integrityHash?: string | null;
  createdAt: string;
  updatedAt: string;
  criticalFindingsCount: number;
  totalFindingsCount: number;
}

export interface HistoryAlert {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  createdAt: string;
}

export interface HistorySummary {
  totalChecks: number;
  compliantCount: number;
  nonCompliantCount: number;
  pendingCount: number;
  complianceRate: number;
  recentAlerts: HistoryAlert[];
}

export interface HistoryResponse {
  data: HistoryItem[];
  summary: HistorySummary;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    requestId?: string;
  };
}

export type AppNotificationType = 'REGULATION_UPDATE' | 'CHECK_COMPLETED' | 'RISK_ALERT' | 'SYSTEM';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface NotificationListResponse {
  data: AppNotification[];
  unreadCount: number;
  total: number;
}

export function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}


