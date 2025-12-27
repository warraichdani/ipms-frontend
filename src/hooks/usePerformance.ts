import { useQuery } from "@tanstack/react-query";
import type { PerformancePointDto } from "../models/performance";
import apiClient from "../lib/apiClient";

export function usePerformance(investmentId: string) {
    return useQuery({
        queryKey: ["investment-performance", investmentId],
        queryFn: async () => {
            const { data } = await apiClient.get<PerformancePointDto[]>(`/investments/${investmentId}/performance`);
            return data ?? [];
        },
        enabled: !!investmentId,
    });
}
