import type { Launch } from "./launch";

export interface SpaceXPaginatedResponse<T> {
  docs: T[];
  totalDocs: number;
  offset: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

export interface LaunchQueryFilters {
  upcoming?: boolean;
  success?: boolean;
  search?: string;
  dateRange?: { start: string; end: string };
}

export interface LaunchQuerySort {
  field: "date_utc" | "name" | "flight_number";
  direction: "asc" | "desc";
}

export interface LaunchQueryParams {
  page: number;
  limit: number;
  filters?: LaunchQueryFilters;
  sort?: LaunchQuerySort;
}

export type LaunchesPageResponse = SpaceXPaginatedResponse<Launch>;
