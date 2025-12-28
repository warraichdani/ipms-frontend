// src/hooks/useSystemStatistics.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

export type SystemStatisticsDto = {
  totalUsers: number;
  totalPortfolios: number;
  totalInvestmentsCurrentValue: number;
  todaysTransactionsCount: number;
};

export function useSystemStatistics() {
  return useQuery<SystemStatisticsDto>({
    queryKey: ["system-statistics"],
    queryFn: async () => {
      const { data } = await apiClient.get<SystemStatisticsDto>("/system/statistics");
      return data;
    },
  });
}