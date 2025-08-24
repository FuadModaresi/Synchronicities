
"use client";

import { useState } from "react";
import type { GenerateSynchronicityInsightsOutput } from "@/ai/flows/generate-synchronicity-insights";
import { EventEntryForm } from "@/components/event-entry-form";
import { InsightCard } from "@/components/insight-card";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";


export default function HomePage() {
  const t = useTranslations('HomePage');
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] =
    useState<GenerateSynchronicityInsightsOutput | null>(null);

  const handleInsightGenerated = (
    generatedInsight: GenerateSynchronicityInsightsOutput | null
  ) => {
    setInsight(generatedInsight);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-6">
          <header>
            <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-2">
              {t('title')}
            </h1>
            <p className="text-muted-foreground text-lg">
              {t('description')}
            </p>
          </header>
          <EventEntryForm
            onInsightGenerated={handleInsightGenerated}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        </div>

        <div className="flex items-center justify-center lg:py-8">
           {isLoading ? (
             <div className="flex flex-col items-center text-center text-muted-foreground">
               <Sparkles className="h-12 w-12 text-primary animate-pulse" />
               <p className="mt-4 font-semibold">{t('insightLoading')}</p>
             </div>
           ) : insight ? (
            <InsightCard insight={insight.insight} />
          ) : (
            <Card className="w-full max-w-md bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle>{t('insightPlaceholderTitle')}</CardTitle>
                    <CardDescription>{t('insightPlaceholderDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center text-center text-muted-foreground py-8">
                        <Sparkles className="h-12 w-12" />
                    </div>
                </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
