import { DocumentType } from '@prisma/client';

export interface DocumentItemDTO {
  id: string;
  title: string;
  type: DocumentType;
  fileUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  batches?: {
    batchId: string;
    batchCode?: string;
  }[];
}

export interface GateKeyStatus {
  type: DocumentType;
  label: string;
  shortLabel: string;
  description: string;
  required: boolean;
  isUploaded: boolean;
  document?: DocumentItemDTO;
}

export interface BatchDocumentChecklistDTO {
  batchId: string;
  batchCode: string;
  totalRequired: number;
  uploadedRequiredCount: number;
  completionRate: number; // 0 to 100%
  isReadyForCheck: boolean;
  keys: {
    phyto: GateKeyStatus;
    labReport: GateKeyStatus;
    co: GateKeyStatus;
    packingList: GateKeyStatus;
    gpsMap: GateKeyStatus;
    other: DocumentItemDTO[];
  };
}

export interface UploadBatchDocumentDTO {
  title: string;
  type: DocumentType;
  fileUrl: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ListDocumentsQueryDTO {
  page?: number;
  pageSize?: number;
  type?: DocumentType;
  batchId?: string;
  search?: string;
}
