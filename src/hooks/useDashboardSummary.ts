// src/hooks/useDashboardSummary.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

export type DashboardSummaryDto = {
  totalCurrentValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  activeInvestmentsCount: number;
  bestPerformerName?: string;
  bestPerformerGainPercent?: number;
  worstPerformerName?: string;
  worstPerformerGainPercent?: number;
};

export function useDashboardSummary() {
  return useQuery<DashboardSummaryDto>({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const { data } = await apiClient.get<DashboardSummaryDto>("/dashboard");
      return data;
    },
  });
}