"use client";

import { ExternalLink } from "lucide-react";
import type { Launch } from "@/types/launch";
import type { Rocket } from "@/types/rocket";
import type { LaunchPad } from "@/types/launchpad";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";

interface LaunchDetailProps {
  launch: Launch;
  rocket: Rocket;
  launchpad: LaunchPad;
}

function formatDate(dateUtc: string | null): string {
  if (!dateUtc) return "Unknown";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateUtc));
}

export function LaunchDetail({ launch, rocket, launchpad }: LaunchDetailProps) {
  const flickrImages = launch.links.flickr.original.filter(Boolean);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              #{launch.flight_number}
            </span>
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
          <h1 className="text-3xl font-bold">{launch.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {formatDate(launch.date_utc)}
          </p>
        </div>
        <FavoriteButton launchId={launch.id} />
      </div>

      {launch.details && (
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold">Mission Details</h2>
          <p className="leading-relaxed text-muted-foreground">
            {launch.details}
          </p>
        </section>
      )}

      {launch.failures.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 text-lg font-semibold text-destructive">
            Failures
          </h2>
          <ul className="space-y-2">
            {launch.failures.map((f, i) => (
              <li key={i} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
                {f.reason}
                {f.altitude !== null && (
                  <span className="ml-2 text-muted-foreground">
                    at {f.altitude}m altitude
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {flickrImages.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Gallery</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {flickrImages.map((src, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border bg-muted"
              >
                <img
                  src={src}
                  alt={`${launch.name} photo ${i + 1}`}
                  className="size-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {(launch.links.webcast || launch.links.article || launch.links.wikipedia || launch.links.presskit) && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Links</h2>
          <div className="flex flex-wrap gap-2">
            {launch.links.webcast && (
              <Button variant="outline" size="sm" asChild>
                <a href={launch.links.webcast} target="_blank" rel="noopener noreferrer">
                  Webcast <ExternalLink className="ml-1 size-3" />
                </a>
              </Button>
            )}
            {launch.links.article && (
              <Button variant="outline" size="sm" asChild>
                <a href={launch.links.article} target="_blank" rel="noopener noreferrer">
                  Article <ExternalLink className="ml-1 size-3" />
                </a>
              </Button>
            )}
            {launch.links.wikipedia && (
              <Button variant="outline" size="sm" asChild>
                <a href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer">
                  Wikipedia <ExternalLink className="ml-1 size-3" />
                </a>
              </Button>
            )}
            {launch.links.presskit && (
              <Button variant="outline" size="sm" asChild>
                <a href={launch.links.presskit} target="_blank" rel="noopener noreferrer">
                  Press Kit <ExternalLink className="ml-1 size-3" />
                </a>
              </Button>
            )}
          </div>
        </section>
      )}

      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Rocket</h2>
          <div className="rounded-xl border p-4">
            <div className="flex items-center gap-3 mb-3">
              {rocket.flickr_images[0] && (
                <img
                  src={rocket.flickr_images[0]}
                  alt={rocket.name}
                  className="size-12 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold">{rocket.name}</h3>
                <p className="text-sm text-muted-foreground">{rocket.type}</p>
              </div>
            </div>
            {rocket.description && (
              <p className="mb-3 text-sm text-muted-foreground line-clamp-3">
                {rocket.description}
              </p>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">First flight</span>
                <p className="font-medium">{rocket.first_flight}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cost per launch</span>
                <p className="font-medium">${(rocket.cost_per_launch / 1_000_000).toFixed(0)}M</p>
              </div>
              <div>
                <span className="text-muted-foreground">Success rate</span>
                <p className="font-medium">{rocket.success_rate_pct}%</p>
              </div>
              <div>
                <span className="text-muted-foreground">Country</span>
                <p className="font-medium">{rocket.country}</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Launchpad</h2>
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">{launchpad.full_name ?? launchpad.name ?? "Unknown"}</h3>
            <p className="text-sm text-muted-foreground">
              {[launchpad.locality, launchpad.region].filter(Boolean).join(", ")}
            </p>
            {launchpad.status && (
              <Badge variant="outline" className="mt-2 capitalize">
                {launchpad.status}
              </Badge>
            )}
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Launch attempts</span>
                <p className="font-medium">{launchpad.launch_attempts}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Launch successes</span>
                <p className="font-medium">{launchpad.launch_successes}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
