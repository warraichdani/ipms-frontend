import { useQuery } from "@tanstack/react-query";
import type { InvestmentDetailDto } from "../models/investment";
import apiClient from "../lib/apiClient";

export function useInvestmentDetail(investmentId: string) {
    return useQuery({
        queryKey: ["investment-detail", investmentId],
        queryFn: async () => {
            const { data } = await apiClient.get<InvestmentDetailDto>(`/investments/${investmentId}`);
            return data;
        },
        enabled: !!investmentId,
    });
}