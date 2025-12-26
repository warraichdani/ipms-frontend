// src/models/updatePrice.ts
export type UpdatePriceResponse = {
  investmentId: string;   // Guid from backend
  unitPrice: number;      // Updated unit price
  priceDate: string;      // ISO date string (map from DateOnly)
  marketValue: number;    // Updated market value after price change
};