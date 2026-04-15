import { launchSchema } from "@/types/launch";
import { rocketSchema } from "@/types/rocket";
import { launchpadSchema } from "@/types/launchpad";
import {
  launchesPageResponseSchema,
  type LaunchQueryParams,
  type LaunchesPageResponse,
} from "@/types/api";
import type { Launch } from "@/types/launch";
import type { Rocket } from "@/types/rocket";
import type { LaunchPad } from "@/types/launchpad";

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

export class SpaceXValidationError extends Error {
  constructor(
    public readonly endpoint: string,
    public readonly cause: z.ZodError
  ) {
    const MAX_ISSUES = 2;
    const issues = cause.issues.slice(0, MAX_ISSUES);
    const suffix = cause.issues.length > MAX_ISSUES
      ? ` (+${cause.issues.length - MAX_ISSUES} more)`
      : "";
    super(
      `Validation failed for ${endpoint}: ${issues.map((e) => e.message).join(", ")}${suffix}`
    );
    this.name = "SpaceXValidationError";
  }
}

import { z } from "zod";

function validate<T>(schema: z.ZodType<T>, data: unknown, endpoint: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[SpaceX] Validation error on ${endpoint}:`, result.error.issues);
    throw new SpaceXValidationError(endpoint, result.error);
  }
  return result.data;
}

async function spacexFetch<T>(
  endpoint: string,
  schema: z.ZodType<T>,
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

  const data: unknown = await res.json();
  return validate(schema, data, endpoint);
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

  return spacexFetch("/launches/query", launchesPageResponseSchema, {
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
  return spacexFetch(`/launches/${id}`, launchSchema);
}

export async function fetchRocket(id: string): Promise<Rocket> {
  return spacexFetch(`/rockets/${id}`, rocketSchema);
}

export async function fetchLaunchpad(id: string): Promise<LaunchPad> {
  return spacexFetch(`/launchpads/${id}`, launchpadSchema);
}
