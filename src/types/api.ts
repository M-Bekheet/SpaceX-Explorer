import { z } from "zod";
import { launchSchema } from "./launch";

export const spaceXPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    docs: z.array(itemSchema),
    totalDocs: z.number(),
    offset: z.number().optional(),
    limit: z.number(),
    totalPages: z.number(),
    page: z.number(),
    pagingCounter: z.number(),
    hasPrevPage: z.boolean(),
    hasNextPage: z.boolean(),
    prevPage: z.number().nullable(),
    nextPage: z.number().nullable(),
  });

export const launchesPageResponseSchema = spaceXPaginatedResponseSchema(launchSchema);

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

export type SpaceXPaginatedResponse<T> = {
  docs: T[];
  totalDocs: number;
  offset?: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type LaunchesPageResponse = SpaceXPaginatedResponse<z.infer<typeof launchSchema>>;
