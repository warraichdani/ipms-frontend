// src/hooks/useAllocation.ts
import { useQuery } from "@tanstack/react-query";
import type { AllocationDto } from "../models/common/types";
import apiClient from "../lib/apiClient";

export function useAllocation() {
  return useQuery<AllocationDto[]>({
    queryKey: ["allocation"],
    queryFn: async () => {
      const { data } = await apiClient.get<AllocationDto[]>("/portfolio/allocation");
      return data;
    },
  });
}