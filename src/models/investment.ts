export type InvestmentDetailDto = {
  investmentId: string;
  investmentName: string;
  investmentType: string;
  currentValue: number;
  gainLossPercent: number;
  status: string;
  totalUnits: number;   // internal use only
  unitPrice: number;
  broker?: string;
  notes?: string;
};