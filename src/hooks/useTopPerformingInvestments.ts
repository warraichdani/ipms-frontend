import { useQuery } from "@tanstack/react-query";
import type { TopPerformingInvestmentRowDto } from "../models/Reports/TopPerformingInvestmentRowDto";
import type { PagedResult } from "./useUsers";
import apiClient from "../lib/apiClient";
import type { ReportsFiltersRequest } from "../models/common/types";
import { useState } from "react";


export function useTopPerformingInvestments(filters: ReportsFiltersRequest) {
const [page, setPage] = useState(filters.page);
const pageSize = filters.pageSize;

  const query = useQuery({
    queryKey: ["top-performing-investments", filters],
    queryFn: async () => {
      const { data } = await apiClient.post<PagedResult<TopPerformingInvestmentRowDto>>(
        "/reports/top-performing-investments",
        { ...filters, page, pageSize }
      );
      return data;
    },
    enabled: !!filters.from && !!filters.to,
  });

  return { ...query, page, setPage, pageSize }
}