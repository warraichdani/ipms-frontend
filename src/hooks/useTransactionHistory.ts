import { useQuery } from "@tanstack/react-query";
import type { TransactionHistoryRowDto } from "../models/Reports/TransactionHistoryRowDto";
import type { ReportsFiltersRequest } from "../models/common/types";
import apiClient from "../lib/apiClient";
import { useState } from "react";
import type { PagedResult } from "./useUsers";

export function useTransactionHistory(filters: ReportsFiltersRequest) {
  const [page, setPage] = useState(filters.page);
  const pageSize = filters.pageSize;

  const query = useQuery({
    queryKey: ["transaction-history", filters, page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.post<PagedResult<TransactionHistoryRowDto>>(
        "/reports/transactions",
        { ...filters, page, pageSize }
      );
      return data;
    },
     enabled: !!filters.from && !!filters.to, 
  });
  return { ...query, page, setPage, pageSize };
}
