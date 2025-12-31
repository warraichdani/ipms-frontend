import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import { useState } from "react";
import type { PagedResult, ReportsFiltersRequest } from "../models/common/types";

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

export function usePerformanceSummaryReport(filters: ReportsFiltersRequest) {
  const [page, setPage] = useState(filters.page);
  const pageSize = filters.pageSize;

  const query = useQuery({
    queryKey: ["performance-summary", filters, page],
    queryFn: async () => {
      const { data } = await apiClient.post<PagedResult<DailyPerformanceSummaryDto>>(
        "/reports/performance-summary",
        { ...filters, page, pageSize }
      );
      return data;
    },
    enabled: !!filters.from && !!filters.to, // ✅ only runs after Apply sets valid dates
  });

  return { ...query, page, setPage, pageSize };
}

