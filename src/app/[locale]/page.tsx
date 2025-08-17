
"use client";

import { useState } from "react";
import type { GenerateSynchronicityInsightsOutput } from "@/ai/flows/generate-synchronicity-insights";
import { EventEntryForm } from "@/components/event-entry-form";
import { InsightCard } from "@/components/insight-card";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations('HomePage');
  const [currentInsight, setCurrentInsight] =
    useState<GenerateSynchronicityInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mb-8">
          {t('description')}
        </p>
        <EventEntryForm
          onInsightGenerated={setCurrentInsight}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </div>
      <div className="flex flex-col items-center justify-center bg-card rounded-xl p-8 border border-dashed">
        {isLoading ? (
          <div className="text-center">
            <Sparkles className="mx-auto h-12 w-12 animate-pulse text-primary" />
            <p className="font-headline text-2xl mt-4 text-muted-foreground">
              {t('insightLoading')}
            </p>
          </div>
        ) : currentInsight ? (
          <InsightCard insight={currentInsight.insight} />
        ) : (
          <div className="text-center">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="font-headline text-2xl mt-4 text-muted-foreground">
              {t('insightPlaceholderTitle')}
            </p>
            <p className="text-sm mt-2 text-muted-foreground/80 max-w-sm">
              {t('insightPlaceholderDescription')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
