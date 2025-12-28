// src/hooks/useRecentActivities.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

export type RecentActivityDto = {
  userId?: string;
  action: string;
  summary?: string;
  occurredAt: string;
};

export function useRecentActivities() {
  return useQuery<RecentActivityDto[]>({
    queryKey: ["recent-activities"],
    queryFn: async () => {
      const { data } = await apiClient.get<RecentActivityDto[]>("/activities/recent");
      return data;
    },
  });
}