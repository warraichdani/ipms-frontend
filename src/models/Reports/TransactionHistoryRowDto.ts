export type TransactionHistoryRowDto = {
  transactionId: string;
  transactionDate: string; // map DateOnly to string (yyyy-MM-dd)
  investmentName: string;
  investmentStatus: string;
  transactionType: string;
  units: number;
  unitPrice: number;
  amount: number;
  totalInvestmentValueAtDate: number;
  gainLossAtDate: number;
};
