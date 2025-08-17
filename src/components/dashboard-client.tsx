
"use client";

import { useMemo } from "react";
import { useEvents } from "@/hooks/use-events";
import { HistoryTable } from "@/components/history-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";


const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function DashboardClient() {

  const { events } = useEvents();

  const numberFrequency = useMemo(() => {
    const counts: { [key: number]: number } = {};
    events.forEach((event) => {
      counts[event.number] = (counts[event.number] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([number, count]) => ({ number, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // show top 10
  }, [events]);

  const mostFrequentNumber = numberFrequency.length > 0 ? numberFrequency[0].number : 'N/A';
  const totalEvents = events.length;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              synchronicity events recorded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Most Frequent Number
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostFrequentNumber}</div>
            <p className="text-xs text-muted-foreground">
              is your most common sign
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Number Frequency</CardTitle>
            <CardDescription>
              Top 10 most frequently recorded numbers or signs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={numberFrequency} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="number"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
         <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Coming Soon: Emotional Timeline</CardTitle>
            <CardDescription>
              Visualize how your emotional state correlates with synchronicity events over time.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
             <div className="text-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics chart will be available here.</p>
             </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-headline text-3xl font-bold mb-4">Event History</h2>
        <HistoryTable events={events} />
      </div>
    </div>
  );
}
