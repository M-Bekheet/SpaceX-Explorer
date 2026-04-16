import { Suspense } from "react";
import { LaunchList } from "@/components/launches/LaunchList";
import { LaunchFilters } from "@/components/launches/LaunchFilters";
import { LaunchSearch } from "@/components/launches/LaunchSearch";

export const dynamic = "force-dynamic";

export default function LaunchesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Launches</h1>
      <div className="mb-6 flex flex-col gap-4">
        <Suspense>
          <LaunchSearch />
          <LaunchFilters />
        </Suspense>
      </div>
      <Suspense>
        <LaunchList />
      </Suspense>
    </div>
  );
}
