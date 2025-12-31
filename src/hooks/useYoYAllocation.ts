import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import type { YoYAllocationRowDto } from "../models/common/types";

export function useYoYAllocation() {
  return useQuery({
    queryKey: ["yoy-allocation"],
    queryFn: async () => {
      const { data } = await apiClient.get<{ rows: YoYAllocationRowDto[] }>(
        "/reports/yoy-allocation"
      );
      return data.rows;
    },
  });
}