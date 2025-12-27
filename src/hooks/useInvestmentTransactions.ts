import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import type { TransactionDto } from "../models/transaction";

export function  useInvestmentTransactions(investmentId: string) {
  return useQuery({
    queryKey: ["investment-transactions", investmentId],
    queryFn: async () => {
      const response = await apiClient.get(`/investments/${investmentId}/transactions`);
      const txs = response.data.items; // ✅ unwrap Items
      return (txs ?? []).slice().sort((a: TransactionDto, b: TransactionDto) =>
        a.transactionDate < b.transactionDate ? 1 : -1
      );
    },
    enabled: !!investmentId,
  });
}