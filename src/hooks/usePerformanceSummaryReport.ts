import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { useState } from "react";

export interface DailyPerformanceSummaryDto {
  date: string; // ISO string from backend
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  activeInvestmentsCount: number;
  bestPerformerName?: string;
  bestPerformerGainPercent?: number;
  worstPerformerName?: string;
  worstPerformerGainPercent?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface PerformanceSummaryFilters {
  from: string;
  to: string;
  investmentTypes?: string[];
  page: number;
  pageSize: number;
}

export function usePerformanceSummaryReport(filters: PerformanceSummaryFilters) {
  const [page, setPage] = useState(filters.page ?? 1);
  const pageSize = filters.pageSize ?? 30;

  const query = useQuery({
    queryKey: ["performance-summary", filters, page],
    queryFn: async () => {
      const { data } = await apiClient.post<PagedResult<DailyPerformanceSummaryDto>>(
        "/reports/performance-summary",
        { ...filters, page, pageSize }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    page,
    setPage,
    pageSize,
  };
}