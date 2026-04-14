import type { Launch } from "@/types/launch";
import type { Rocket } from "@/types/rocket";
import type { LaunchPad } from "@/types/launchpad";
import type {
  LaunchQueryParams,
  LaunchesPageResponse,
} from "@/types/api";

const SPACEX_API_URL =
  process.env.NEXT_PUBLIC_SPACEX_API_URL || "https://api.spacexdata.com/v4";

export class SpaceXApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "SpaceXApiError";
    this.status = status;
  }
}

async function spacexFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${SPACEX_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new SpaceXApiError(
      res.status,
      `SpaceX API error: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

export async function fetchLaunches(
  params: LaunchQueryParams
): Promise<LaunchesPageResponse> {
  const query: Record<string, unknown> = {};

  if (params.filters) {
    if (params.filters.upcoming !== undefined) {
      query.upcoming = params.filters.upcoming;
    }
    if (params.filters.success !== undefined) {
      query.success = params.filters.success;
    }
    if (params.filters.search) {
      query["$text"] = { $search: params.filters.search };
    }
    if (params.filters.dateRange) {
      query.date_utc = {
        $gte: params.filters.dateRange.start,
        $lte: params.filters.dateRange.end,
      };
    }
  }

  const sort: Record<string, 1 | -1> = {};
  if (params.sort) {
    sort[params.sort.field] = params.sort.direction === "asc" ? 1 : -1;
  } else {
    sort.date_utc = -1;
  }

  return spacexFetch<LaunchesPageResponse>("/launches/query", {
    method: "POST",
    body: JSON.stringify({
      query: Object.keys(query).length > 0 ? query : {},
      options: {
        page: params.page,
        limit: params.limit,
        sort,
      },
    }),
  });
}

export async function fetchLaunchById(id: string): Promise<Launch> {
  return spacexFetch<Launch>(`/launches/${id}`);
}

export async function fetchRocket(id: string): Promise<Rocket> {
  return spacexFetch<Rocket>(`/rockets/${id}`);
}

export async function fetchLaunchpad(id: string): Promise<LaunchPad> {
  return spacexFetch<LaunchPad>(`/launchpads/${id}`);
}
