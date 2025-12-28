// src/hooks/useUsers.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

export type UserDto = {
  userId: string;
  email: string;
  firstName: string;
  lastName?: string;
  isActive: boolean;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
};

export function useUsers(search: string, page: number, pageSize: number) {
  return useQuery<PagedResult<UserDto>>({
    queryKey: ["list-users", search, page, pageSize],
    queryFn: async () => {
      const { data } = await apiClient.get<PagedResult<UserDto>>("/users", {
        params: { search, page, pageSize },
      });
      return data;
    },
     placeholderData: keepPreviousData,
  });
}