import { notFound } from "next/navigation";
import { fetchLaunchById, fetchRocket, fetchLaunchpad } from "@/lib/spacex-api";
import { LaunchDetail } from "@/components/launch-detail";

export default async function LaunchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let launch;
  try {
    launch = await fetchLaunchById(id);
  } catch {
    notFound();
  }

  const [rocket, launchpad] = await Promise.all([
    fetchRocket(launch.rocket ?? ""),
    fetchLaunchpad(launch.launchpad ?? ""),
  ]);

  return <LaunchDetail launch={launch} rocket={rocket} launchpad={launchpad} />;
}
