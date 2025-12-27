// src/hooks/useAllocation.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

export type AllocationDto = {
  investmentType: string;
  value: number;
};

export function useAllocation() {
  return useQuery<AllocationDto[]>({
    queryKey: ["allocation"],
    queryFn: async () => {
      const { data } = await apiClient.get<AllocationDto[]>("/portfolio/allocation");
      return data;
    },
  });
}