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
  scientificName: string;
  bilingualChecked: boolean;
  checkedFields: string[];
  missingFields: string[];
  status: 'PASSED' | 'INCOMPLETE';
}

export interface CoOriginBlindSpot {
  coNumber?: string;
  formType: string;
  tariffPreferenceRate: string;
  status: 'VALID' | 'PENDING' | 'MISSING';
}

export interface BlindSpotCheckResult {
  cadmium: CadmiumBlindSpot;
  pucPhc: PucPhcBlindSpot;
  phytoWindow: PhytoWindowBlindSpot;
  labeling: LabelingBlindSpot;
  coOrigin: CoOriginBlindSpot;
  overallBlindSpotScore: number;
}

export interface ReportFinding {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
  status: string;
  deviation?: string | null;
  remediation?: string | null;
  citationTitle?: string;
  citationArticle?: string;
}

export interface LegalCitation {
  id: string;
  code: string;
  title: string;
  article: string;
  summary: string;
  authority: string;
}

export interface ReportDocumentSummary {
  id: string;
  type: string;
  title: string;
  fileUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
}

export interface ReportDetail {
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
  findings: ReportFinding[];
  citations: LegalCitation[];
  documents: ReportDocumentSummary[];
}

export interface ApproveReportPayload {
  notes?: string;
  containerSealNumber?: string;
  exportPort?: string;
}
