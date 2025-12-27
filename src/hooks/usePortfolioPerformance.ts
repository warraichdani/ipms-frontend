// src/hooks/usePerformance.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import type { PerformancePointDto } from "../models/performance";

export function usePortfolioPerformance() {
  return useQuery<PerformancePointDto[]>({
    queryKey: ["portfolio-performance"],
    queryFn: async () => {
      const { data } = await apiClient.get<PerformancePointDto[]>("/dashboard/performance");
      return data;
    },
  });
}