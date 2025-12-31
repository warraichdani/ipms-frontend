export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface ReportsFiltersRequest {
  from: string;
  to: string;
  investmentTypes?: string[];
  page: number;
  pageSize: number;
  exportAll: boolean;
}

export type AllocationDto = {
  investmentType: string;
  value: number;
};