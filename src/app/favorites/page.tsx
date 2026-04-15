"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useQueries } from "@tanstack/react-query";
import { queryOptions } from "@/lib/query-client";
import type { Launch } from "@/types/launch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(dateUtc: string | null): string {
  if (!dateUtc) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateUtc));
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useLocalStorage<string[]>(
    "spacex-favorites",
    []
  );

  const launchQueries = useQueries({
    queries: favorites.map((id) => ({
      ...queryOptions.launches.detail(id),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const loadedLaunches = useMemo(
    () =>
      launchQueries
        .filter((q) => q.isSuccess && q.data)
        .map((q) => q.data as Launch),
    [launchQueries]
  );

  const isLoading = launchQueries.some((q) => q.isLoading);

  function removeFavorite(id: string) {
    setFavorites((prev) => prev.filter((fId) => fId !== id));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Favorites</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <Heart className="size-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">
            No favorites yet
          </p>
          <p className="text-sm text-muted-foreground">
            Click the heart icon on any launch to save it here.
          </p>
          <Button variant="outline" asChild>
            <Link href="/launches">Browse launches</Link>
          </Button>
        </div>
      ) : isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: favorites.length }).map((_, i) => (
            <div key={i} className="flex gap-3 rounded-xl border p-4">
              <Skeleton className="size-12 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {loadedLaunches.map((launch) => (
            <div
              key={launch.id}
              className="group flex items-center gap-3 rounded-xl border bg-card p-4 ring-1 ring-foreground/10"
            >
              <Link
                href={`/launches/${launch.id}`}
                className="flex flex-1 items-center gap-3 min-w-0"
              >
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {launch.links.patch.small ? (
                    <Image
                      src={launch.links.patch.small}
                      alt={`${launch.name} patch`}
                      className="size-full object-contain p-1"
                      width={48}
                      height={48}
                    />
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      {launch.flight_number}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="truncate font-medium group-hover:underline">
                    {launch.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(launch.date_utc)}
                  </p>
                  <div className="flex gap-1">
                    {launch.upcoming ? (
                      <Badge variant="secondary" className="text-[10px]">
                        Upcoming
                      </Badge>
                    ) : launch.success ? (
                      <Badge className="bg-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400">
                        Success
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">
                        Failed
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeFavorite(launch.id)}
                aria-label={`Remove ${launch.name} from favorites`}
              >
                <Trash2 className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
