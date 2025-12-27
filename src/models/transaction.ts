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

// src/models/transaction.ts

export type AllTransactionListFilter = {
  page?: number;
  pageSize?: number;
  investmentId?: string | null;
  transactionType?: string | null;
  from?: string | null; 
  to?: string | null;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type AllTransactionListItemDto = {
  transactionId: string;
  investmentId: string;
  investmentName: string;
  transactionType: string;
  units: number;
  unitPrice: number;
  amount: number;
  date: string; // ISO date string
};