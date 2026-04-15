import { Skeleton } from "@/components/ui/skeleton";

export function LaunchSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-4 ring-1 ring-foreground/10">
      <Skeleton className="size-16 shrink-0 rounded-lg" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
        <div className="mt-1 flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="size-7 shrink-0 rounded-md" />
    </div>
  );
}
