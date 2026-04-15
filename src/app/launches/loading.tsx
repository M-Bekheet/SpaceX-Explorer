import { LaunchSkeleton } from "@/components/launches/LaunchSkeleton";

export default function LaunchesLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="mb-6 h-8 w-full animate-pulse rounded bg-muted" />
      <div className="flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <LaunchSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
