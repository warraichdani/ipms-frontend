import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import type { AllTransactionListFilter, PagedResult, AllTransactionListItemDto } from "../models/transaction";
import cleanParams from "../utilities/cleanParams";

export function useAllTransactions(filter: AllTransactionListFilter) {
  return useQuery<PagedResult<AllTransactionListItemDto>>({
    queryKey: ["all-transactions", filter],
    queryFn: async () => {
      const { data } = await apiClient.get<PagedResult<AllTransactionListItemDto>>(
        "/transactions",
        { params: cleanParams(filter) }
      );
      return data;
    },
    placeholderData: keepPreviousData,
  });
}

