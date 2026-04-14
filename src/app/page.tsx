import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-primary/10">
        <Rocket className="size-10 text-primary" />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          SpaceX Explorer
        </h1>
        <p className="mx-auto max-w-md text-lg text-muted-foreground">
          Browse launches, rockets, and launchpads using the SpaceX API.
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild size="lg">
          <Link href="/launches">Explore Launches</Link>
        </Button>
      </div>
    </div>
  );
}
