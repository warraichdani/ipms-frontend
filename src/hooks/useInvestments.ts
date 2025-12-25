// src/hooks/useInvestments.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

export type InvestmentListItemDto = {
  investmentId: string;
  name: string;
  type: string;
  amount: number;
  currentValue: number;
  gainLossPercent: number;
  purchaseDate: string;
  status: string;
};

export type InvestmentListResultDto = {
  items: InvestmentListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export type InvestmentListFilter = {
  search?: string | null;
  type?: string | null;
  status?: string | null;
  fromDate?: string | null;
  toDate?: string | null;
  minGainLossPercent?: number | null;
  maxGainLossPercent?: number | null;
  sortBy?: "Amount" | "CurrentValue" | "GainLoss" | "Date";
  sortDirection?: "ASC" | "DESC";
  page?: number;
  pageSize?: number;
};

export function useInvestments(filter: InvestmentListFilter) {
  return useQuery<InvestmentListResultDto>({
    queryKey: ["investments", filter],
    queryFn: async () => {
      const { data } = await apiClient.get<InvestmentListResultDto>("/investments", { params: filter });
      return data;
    },
    placeholderData: keepPreviousData, // ✅ v5 replacement
  });
}