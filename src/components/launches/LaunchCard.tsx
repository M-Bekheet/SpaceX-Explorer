"use client";

import Link from "next/link";
import Image from "next/image";
import { Rocket } from "lucide-react";
import type { Launch } from "@/types/launch";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

interface LaunchCardProps {
  launch: Launch;
}

function formatDate(dateUtc: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateUtc));
}

export function LaunchCard({ launch }: LaunchCardProps) {
  return (
    <Link
      href={`/launches/${launch.id}`}
      className="group flex items-center gap-4 rounded-xl border bg-card p-4 ring-1 ring-foreground/10 transition-colors hover:bg-muted/50"
    >
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
        {launch.links.patch.small ? (
          <Image
            src={launch.links.patch.small}
            alt={`${launch.name} patch`}
            className="size-full object-contain p-1"
            width={64}
            height={64}
          />
        ) : (
          <Rocket className="size-8 text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            #{launch.flight_number}
          </span>
          <h3 className="truncate font-medium group-hover:underline">
            {launch.name}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {launch.date_utc ? formatDate(launch.date_utc) : "Date unknown"}
        </p>
        <div className="mt-1 flex gap-2">
          {launch.upcoming ? (
            <Badge variant="secondary">Upcoming</Badge>
          ) : launch.success ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Success
            </Badge>
          ) : (
            <Badge variant="destructive">Failed</Badge>
          )}
        </div>
      </div>

      <div
        className="shrink-0"
        onClick={(e) => e.preventDefault()}
      >
        <FavoriteButton launchId={launch.id} />
      </div>
    </Link>
  );
}
