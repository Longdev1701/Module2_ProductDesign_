export interface AuditLogActorDTO {
  id: string;
  email: string;
  fullName: string | null;
  platformRole: string;
  avatarUrl: string | null;
}

export interface AuditLogItemDTO {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  createdAt: string;
  actor: AuditLogActorDTO;
  actionLabelVi: string;
}

export interface AuditLogListDTO {
  logs: AuditLogItemDTO[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface VerificationResultDTO {
  isValid: boolean;
  status: 'AUTHENTIC_VALID' | 'ALTERED_TAMPERED' | 'NOT_FOUND';
  message: string;
  report?: {
    id: string;
    reportCode: string;
    title: string;
    version: number;
    status: string;
    batchCode: string;
    productName: string;
    integrityHash: string;
    approvedAt: string | null;
    approverName: string | null;
    approverEmail: string | null;
    approverRole: string | null;
    containerSealNumber?: string;
    exportPort?: string;
    qrCodeData: string;
  };
  auditRecord?: {
    id: string;
    action: string;
    timestamp: string;
    actorEmail: string;
    ipAddress: string | null;
  };
}

export interface IntegrityStatsDTO {
  totalLoggedEvents: number;
  sealedReportsCount: number;
  activeActorsCount: number;
  hashChainStatus: 'HEALTHY_INTACT' | 'WARNING';
  hashChainIntegrityRate: number; // 100%
  lastSealedEventAt: string | null;
}
