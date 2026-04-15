"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { fetchLaunchSummaries } from "@/lib/spacex-api";
import { Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface YearData {
  year: string;
  total: number;
  successes: number;
  failures: number;
  successRate: number;
}

function aggregateByYear(launches: { date_utc: string | null; success: boolean | null; upcoming: boolean }[]): YearData[] {
  const map = new Map<string, { total: number; successes: number }>();

  for (const launch of launches) {
    if (launch.upcoming || !launch.date_utc) continue;
    const year = new Date(launch.date_utc).getFullYear().toString();
    const entry = map.get(year) ?? { total: 0, successes: 0 };
    entry.total++;
    if (launch.success === true) entry.successes++;
    map.set(year, entry);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([year, { total, successes }]) => ({
      year,
      total,
      successes,
      failures: total - successes,
      successRate: total > 0 ? Math.round((successes / total) * 100) : 0,
    }));
}

export default function ChartsPage() {
  const { data: launches, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["launches", "all"],
    queryFn: fetchLaunchSummaries,
    staleTime: 10 * 60 * 1000,
  });

  const chartData = useMemo(
    () => (launches ? aggregateByYear(launches) : []),
    [launches]
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Launch Statistics</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading launch data...</span>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <p className="text-muted-foreground">{error?.message ?? "Failed to load data"}</p>
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Launches per Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="successes" name="Successes" fill="#10b981" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="failures" name="Failures" fill="#ef4444" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Success Rate per Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      className="fill-muted-foreground"
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value}%`, "Success Rate"]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="successRate"
                      name="Success Rate"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
