export type PlatformRole = "USER" | "SUPPORT" | "PLATFORM_ADMIN" | "SUPER_ADMIN";

export type OrganizationRole = "OWNER" | "MANAGER" | "COMPLIANCE" | "VIEWER";

export interface ApiResponse<T = unknown> {
  data: T;
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

export interface AdminOrganizationInput {
  name: string;
  taxCode?: string;
  address?: string;
  legalRepresentative?: string;
  contactEmail?: string;
  contactPhone?: string;
  primaryProduct?: string;
  exportMarkets?: string[];
}

export interface AdminUser extends UserProfile {
  organizations?: Array<{
    id: string;
    name: string;
    role: OrganizationRole;
  }>;
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
  documentsCount?: number;
  checksCount?: number;
}

export interface CreateProductInput {
  name: string;
  category: string;
  hsCode?: string | null;
  description?: string | null;
  origin?: string | null;
  markets?: Array<{ marketCode: string; marketName: string }>;
}

export interface UpdateProductInput {
  name?: string;
  category?: string;
  hsCode?: string | null;
  description?: string | null;
  origin?: string | null;
  markets?: Array<{ marketCode: string; marketName: string }>;
}

export interface CreateBatchInput {
  batchCode: string;
  productId: string;
  quantity?: number | null;
  unit?: string;
  status?: BatchStatus;
  producedAt?: string | null;
  expiresAt?: string | null;
}

export interface UpdateBatchInput {
  batchCode?: string;
  productId?: string;
  quantity?: number | null;
  unit?: string;
  status?: BatchStatus;
  producedAt?: string | null;
  expiresAt?: string | null;
}

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
  batches?: Array<{
    batchId: string;
    batchCode?: string;
  }>;
}

export interface GateKeyStatus {
  type: DocumentType;
  label: string;
  shortLabel: string;
  description: string;
  required: boolean;
  isUploaded: boolean;
  document?: DocumentItem;
}

export interface BatchDocumentChecklist {
  batchId: string;
  batchCode: string;
  totalRequired: number;
  uploadedRequiredCount: number;
  completionRate: number;
  isReadyForCheck: boolean;
  keys: {
    phyto: GateKeyStatus;
    labReport: GateKeyStatus;
    co: GateKeyStatus;
    packingList: GateKeyStatus;
    gpsMap: GateKeyStatus;
    other: DocumentItem[];
  };
}

export interface UploadDocumentPayload {
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

export interface DashboardBatchDocSummary {
  id: string;
  title: string;
  fileUrl: string | null;
  mimeType: string | null;
  fileSize: number | null;
}

export interface DashboardSummary {
  totalBatches: number;
  readyForCheckBatches: number;
  actionRequiredBatches: number;
  compliantBatches: number;
  complianceRate: number;
  criticalLegalAlerts: number;
  totalExportVolumeTons: number;
  readyVolumeTons: number;
  pendingVolumeTons: number;
  readyContainersEstimate: number;
  readyValueVndBillion?: number;
  pendingValueVndBillion?: number;
  totalValueVndBillion?: number;
}

export interface DashboardRecentBatch {
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

export function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return fallback;
}

