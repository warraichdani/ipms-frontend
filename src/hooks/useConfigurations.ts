// src/hooks/useConfigurations.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

type ConfigResponse = {
  investmentTypes: string[];
  investmentStatuses: string[];
  transactionTypes: string[];
};

export const CONFIG_QUERY_KEY = ["configurations"];

export function useConfigurations() {
  return useQuery<ConfigResponse>({
    queryKey: CONFIG_QUERY_KEY,
    queryFn: async () => {
      const { data } = await apiClient.get<ConfigResponse>("/configurations");
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1h
    gcTime: 6 * 60 * 60 * 1000, // 6h (v5 replacement for cacheTime)
  });
}

type Option = { label: string; value: string };

export function useInvestmentTypeOptions(): Option[] {
  const { data } = useConfigurations();
  const types: string[] = data?.investmentTypes ?? [];
  return types.map((t: string) => ({ label: t, value: t }));
}

export function useInvestmentStatusOptions(): Option[] {
  const { data } = useConfigurations();
  const statuses: string[] = data?.investmentStatuses ?? [];
  return statuses.map((s: string) => ({ label: s, value: s }));
}

export function useTransactionTypeOptions(): Option[] {
  const { data } = useConfigurations();
  const txTypes: string[] = data?.transactionTypes ?? [];
  return txTypes.map((t: string) => ({ label: t, value: t }));
}