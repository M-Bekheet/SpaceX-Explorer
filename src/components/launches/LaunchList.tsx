"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { List, type RowComponentProps } from "react-window";
import { AlertCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { queryKeys } from "@/lib/query-client";
import { fetchLaunches } from "@/lib/spacex-api";
import type { LaunchQueryParams, LaunchQueryFilters, LaunchQuerySort, LaunchesPageResponse } from "@/types/api";
import { LaunchCard } from "./LaunchCard";
import { LaunchSkeleton } from "./LaunchSkeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";

const PAGE_SIZE = 20;
const ROW_HEIGHT = 120;
const OVERSCAN = 5;

type RowData = {
  launches: import("@/types/launch").Launch[];
};

function LaunchRow({
  index,
  style,
  launches,
}: RowComponentProps<RowData>) {
  const launch = launches[index];
  return (
    <div style={style} className="px-1 py-0.5">
      {launch ? (
        <LaunchCard launch={launch} />
      ) : (
        <LaunchSkeleton />
      )}
    </div>
  );
}

export function LaunchList() {
  const searchParams = useSearchParams();

  const filters: LaunchQueryFilters = useMemo(() => {
    const f: LaunchQueryFilters = {};
    const upcoming = searchParams.get("upcoming");
    const success = searchParams.get("success");
    const search = searchParams.get("search");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (upcoming !== null) f.upcoming = upcoming === "true";
    if (success !== null) f.success = success === "true";
    if (search) f.search = search;
    if (startDate && endDate) f.dateRange = { start: startDate, end: endDate };
    return f;
  }, [searchParams]);

  const sort: LaunchQuerySort = useMemo(
    () => ({ field: "date_utc", direction: "desc" as const }),
    []
  );

  const params: LaunchQueryParams = useMemo(
    () => ({ page: 1, limit: PAGE_SIZE, filters, sort }),
    [filters, sort]
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: queryKeys.launches.list(params),
    queryFn: ({ pageParam }) => fetchLaunches({ ...params, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: LaunchesPageResponse) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    getPreviousPageParam: () => undefined,
  });

  const allLaunches = useMemo(
    () => data?.pages.flatMap((page) => page.docs) ?? [],
    [data?.pages]
  );

  const totalCount = data?.pages[0]?.totalDocs ?? 0;

  const loaderRef = useRef<HTMLDivElement>(null);

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "200px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [onIntersect]);

  if (isLoading  ) {
    return (
      <>
       <Skeleton className="w-30 h-5 mb-3" />
      <div className="flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <LaunchSkeleton key={i} />
        ))}
      </div>
        </>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <AlertCircle className="size-10 text-destructive" />
        <p className="text-muted-foreground">
          {error?.message ?? "Failed to load launches"}
        </p>
        <Button variant="outline" onClick={() => fetchNextPage()}>
          Try again
        </Button>
      </div>
    );
  }

  if (allLaunches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center">
        <p className="text-lg font-medium">No launches found</p>
        <p className="text-sm text-muted-foreground">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {totalCount} {totalCount === 1 ? "launch" : "launches"} found
      </p>
      <List<RowData>
        rowComponent={LaunchRow}
        rowCount={allLaunches.length}
        rowHeight={ROW_HEIGHT}
        rowProps={{ launches: allLaunches }}
        overscanCount={OVERSCAN}
        className="w-full"
        defaultHeight={Math.min(allLaunches.length * ROW_HEIGHT, 800)}

      />
      <div ref={loaderRef} className="h-1" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )}
      {!hasNextPage && allLaunches.length > 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          All launches loaded
        </p>
      )}
    </div>
  );
}
