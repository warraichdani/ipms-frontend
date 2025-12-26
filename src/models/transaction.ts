export type TransactionDto = {
  transactionId: string;
  investmentId: string;
  transactionType: "Buy" | "Sell" | "Update";
  amount: number;
  unitPrice?: number;
  transactionDate: string; // ISO date
  totalUnitsAfter?: number;
  costBasisAfter?: number;
  marketValueAfter?: number;
};