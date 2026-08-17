export interface ProductMarketRequirementDto {
  marketCode: string;
  marketName: string;
}

export interface ProductDto {
  id: string;
  name: string;
  category: string;
  hsCode: string | null;
  description: string | null;
  origin: string | null;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  marketRequirements?: ProductMarketRequirementDto[];
  batchesCount?: number;
}
