import { Skeleton } from "@/components/ui/skeleton";

export default function ChartsLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid gap-6">
        <div className="rounded-xl border p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <Skeleton className="h-80 w-full" />
        </div>
        <div className="rounded-xl border p-6">
          <Skeleton className="mb-4 h-6 w-44" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    </div>
  );
}
