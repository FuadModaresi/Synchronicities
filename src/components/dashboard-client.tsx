
"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
import { BarChart3, TrendingUp, Sparkles, BrainCircuit, Volume2, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { generateDashboardInsights, type GenerateDashboardInsightsOutput } from "@/ai/flows/generate-dashboard-insights";
import { generateAudioReflection, type GenerateAudioReflectionOutput } from "@/ai/flows/generate-audio-reflection";
import { Button } from "./ui/button";


const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function DashboardClient() {
  const t = useTranslations('DashboardPage');
  const locale = useLocale();
  const { events } = useEvents();
  const [analysis, setAnalysis] = useState<GenerateDashboardInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [audio, setAudio] = useState<GenerateAudioReflectionOutput | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);


  useEffect(() => {
    const fetchAnalysis = async () => {
      if (events.length > 0) {
        setIsLoading(true);
        try {
          const result = await generateDashboardInsights({ events, locale });
          setAnalysis(result);
        } catch (error) {
          console.error("Error generating dashboard analysis:", error);
          setAnalysis({ analysis: t('analysisError') });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setAnalysis(null);
      }
    };

    fetchAnalysis();
  }, [events, locale, t]);


  const numberFrequency = useMemo(() => {
    const counts: { [key: string]: number } = {};
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
  
  const handleListen = async () => {
    if (!analysis?.analysis) return;

    // If audio is already generated and loaded, just play it
    if (audio?.audioDataUri && audioRef.current) {
        audioRef.current.play();
        return;
    }

    setIsAudioLoading(true);
    try {
        const audioResult = await generateAudioReflection({ text: analysis.analysis });
        setAudio(audioResult);
    } catch (error) {
        console.error("Error generating audio reflection:", error);
    } finally {
        setIsAudioLoading(false);
    }
  };

  useEffect(() => {
    if (audio?.audioDataUri && audioRef.current) {
        audioRef.current.src = audio.audioDataUri;
        audioRef.current.play();
    }
  }, [audio]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalEvents')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {t('totalEventsDescription')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('mostFrequentNumber')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostFrequentNumber}</div>
            <p className="text-xs text-muted-foreground">
              {t('mostFrequentNumberDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">{t('numberFrequencyTitle')}</CardTitle>
            <CardDescription>
              {t('numberFrequencyDescription')}
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
            <div className="flex items-center justify-between">
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <BrainCircuit className="w-6 h-6 text-primary"/>
                    {t('biggerPictureTitle')}
                </CardTitle>
                {analysis && !isLoading && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleListen}
                        disabled={isAudioLoading}
                        aria-label={t('listenLabel')}
                    >
                        {isAudioLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <Volume2 className="h-5 w-5" />
                        )}
                    </Button>
                )}
            </div>
            <CardDescription>
              {t('biggerPictureDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
             {isLoading ? (
                <div className="text-center text-muted-foreground animate-pulse">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <p>{t('analysisLoading')}</p>
                </div>
              ) : analysis ? (
                <p className="text-sm text-foreground/90 leading-relaxed">{analysis.analysis}</p>
              ) : (
                 <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>{t('noEventsPlaceholder')}</p>
                 </div>
              )}
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="font-headline text-3xl font-bold mb-4">{t('eventHistoryTitle')}</h2>
        <HistoryTable events={events} />
      </div>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
