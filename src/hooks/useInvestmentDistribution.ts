import { useQuery } from "@tanstack/react-query";
import type { AllocationDto, ReportsFiltersRequest } from "../models/common/types";
import apiClient from "../lib/apiClient";

export function useInvestmentDistribution(filters: ReportsFiltersRequest) {
  const query = useQuery({
    queryKey: ["investment-distribution", filters],
    queryFn: async () => {
      const { data } = await apiClient.post<AllocationDto[]>(
        "/reports/investment-distribution",
        filters
      );
      return data;
    },
    enabled: !!filters.from && !!filters.to, // only run when valid date range
  });

  return { ...query };
}