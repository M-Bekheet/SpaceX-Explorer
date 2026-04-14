import { QueryClient } from "@tanstack/react-query";
import { SpaceXApiError } from "./spacex-api";
import {
  fetchLaunches,
  fetchLaunchById,
  fetchRocket,
  fetchLaunchpad,
} from "./spacex-api";
import type { LaunchQueryParams } from "@/types/api";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, error) => {
          if (error instanceof SpaceXApiError) {
            if (error.status === 429) return failureCount < 3;
            if (error.status >= 500) return failureCount < 2;
            return false;
          }
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential
      },
    },
  });
}

export const queryKeys = {
  launches: {
    all: ["launches"] as const,
    lists: () => [...queryKeys.launches.all, "list"] as const,
    list: (params: LaunchQueryParams) =>
      [...queryKeys.launches.lists(), params] as const,
    details: () => [...queryKeys.launches.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.launches.details(), id] as const,
  },
  rockets: {
    all: ["rockets"] as const,
    detail: (id: string) => [...queryKeys.rockets.all, id] as const,
  },
  launchpads: {
    all: ["launchpads"] as const,
    detail: (id: string) => [...queryKeys.launchpads.all, id] as const,
  },
} as const;

export const queryOptions = {
  launches: {
    list: (params: LaunchQueryParams) => ({
      queryKey: queryKeys.launches.list(params),
      queryFn: () => fetchLaunches(params),
    }),
    detail: (id: string) => ({
      queryKey: queryKeys.launches.detail(id),
      queryFn: () => fetchLaunchById(id),
    }),
  },
  rockets: {
    detail: (id: string) => ({
      queryKey: queryKeys.rockets.detail(id),
      queryFn: () => fetchRocket(id),
    }),
  },
  launchpads: {
    detail: (id: string) => ({
      queryKey: queryKeys.launchpads.detail(id),
      queryFn: () => fetchLaunchpad(id),
    }),
  },
};
