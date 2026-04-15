"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LaunchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const upcomingParam = searchParams.get("upcoming");
  const successParam = searchParams.get("success");
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  function setFilter(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/launches?${params.toString()}`, { scroll: false });
  }

  function clearFilters() {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    router.push(`/launches?${params.toString()}`, { scroll: false });
  }

  const hasFilters =
    upcomingParam !== null || successParam !== null || startDate || endDate;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1">
        <Button
          variant={upcomingParam === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming", null)}
        >
          All
        </Button>
        <Button
          variant={upcomingParam === "true" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming", "true")}
        >
          Upcoming
        </Button>
        <Button
          variant={upcomingParam === "false" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("upcoming", "false")}
        >
          Past
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant={successParam === null ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("success", null)}
        >
          All
        </Button>
        <Button
          variant={successParam === "true" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("success", "true")}
        >
          Success
        </Button>
        <Button
          variant={successParam === "false" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("success", "false")}
        >
          Failed
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setFilter("startDate", e.target.value || null)}
          className="h-7 w-36 text-xs"
          aria-label="Start date"
        />
        <span className="text-muted-foreground">to</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setFilter("endDate", e.target.value || null)}
          className="h-7 w-36 text-xs"
          aria-label="End date"
        />
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
