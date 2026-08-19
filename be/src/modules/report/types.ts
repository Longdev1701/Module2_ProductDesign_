export interface CadmiumBlindSpot {
  detectedValue: number;
  limitValue: number;
  unit: string;
  standardCode: string;
  safetyMarginPercent: number;
  status: 'SAFE' | 'WARNING' | 'BREACH' | 'MISSING';
  labName?: string;
  sampleCode?: string;
}

export interface PucPhcBlindSpot {
  pucCode: string;
  phcCode: string;
  isCiferActive: boolean;
  isMatched: boolean;
  status: 'MATCHED' | 'MISMATCH' | 'UNREGISTERED';
  location: string;
}

export interface PhytoWindowBlindSpot {
  issuedAt?: string;
  expiresAt?: string;
  daysRemaining: number;
  clearanceBufferDays: number;
  status: 'SAFE' | 'EXPIRING_SOON' | 'EXPIRED' | 'MISSING';
}

export interface LabelingBlindSpot {
  scientificName: string; // e.g. "Durio zibethinus"
  bilingualChecked: boolean;
  checkedFields: string[];
  missingFields: string[];
  status: 'PASSED' | 'INCOMPLETE';
}

export interface CoOriginBlindSpot {
  coNumber?: string;
  formType: string; // e.g. "Form E (ACFTA)"
  tariffPreferenceRate: string; // e.g. "0%"
  status: 'VALID' | 'PENDING' | 'MISSING';
}

export interface BlindSpotCheckResult {
  cadmium: CadmiumBlindSpot;
  pucPhc: PucPhcBlindSpot;
  phytoWindow: PhytoWindowBlindSpot;
  labeling: LabelingBlindSpot;
  coOrigin: CoOriginBlindSpot;
  overallBlindSpotScore: number; // 0-100%
}

export interface ReportFindingDTO {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  status: string;
  deviation?: string | null;
  remediation?: string | null;
  citationTitle?: string;
  citationArticle?: string;
}

export interface LegalCitationDTO {
  id: string;
  code: string;
  title: string;
  article: string;
  summary: string;
  authority: string;
}

export interface ReportDocumentSummaryDTO {
  id: string;
  type: string;
  title: string;
  fileUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
}

export interface ReportDetailDTO {
  id: string;
  reportCode: string;
  complianceCheckId: string;
  title: string;
  version: number;
  status: 'DRAFT' | 'IN_REVIEW' | 'CHANGES_REQUESTED' | 'APPROVED' | 'FINAL';
  integrityHash?: string | null;
  qrCodeData: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  approverName?: string | null;
  approverEmail?: string | null;
  approverRole?: string | null;
  check: {
    id: string;
    batchId: string;
    batchCode: string;
    productId: string;
    productName: string;
    category: string;
    hsCode: string;
    origin: string;
    quantity: number;
    unit: string;
    market: string;
    checkStatus: string;
    result: string;
    aiConfidence: number;
    summary: string;
  };
  blindSpots: BlindSpotCheckResult;
  findings: ReportFindingDTO[];
  citations: LegalCitationDTO[];
  documents: ReportDocumentSummaryDTO[];
}

export interface HistoryItemDTO {
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
  result: string;
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

export interface HistoryAlertDTO {
  id: string;
  title: string;
  description: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  createdAt: string;
}

export interface HistorySummaryDTO {
  totalChecks: number;
  compliantCount: number;
  nonCompliantCount: number;
  pendingCount: number;
  complianceRate: number;
  recentAlerts: HistoryAlertDTO[];
}

export interface HistoryResponseDTO {
  items: HistoryItemDTO[];
  summary: HistorySummaryDTO;
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

