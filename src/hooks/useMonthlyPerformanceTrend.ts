import { useQuery } from "@tanstack/react-query";
import type { PerformancePointDto } from "../models/performance";
import apiClient from "../lib/apiClient";
import type { ReportsFiltersRequest } from "../models/common/types";

export function useMonthlyPerformanceTrend(filters: ReportsFiltersRequest) {
  const query = useQuery({
    queryKey: ["monthly-performance-trend", filters],
    queryFn: async () => {
      const { data } = await apiClient.post<PerformancePointDto[]>(
        "/reports/monthlyPerformanceTrend",
        filters
      );
      return data;
    },
    enabled: !!filters.from && !!filters.to, // only run when valid date range
  });

  return { ...query };
}
