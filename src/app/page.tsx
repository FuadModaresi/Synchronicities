"use client";

import { useState } from "react";
import type { GenerateSynchronicityInsightsOutput } from "@/ai/flows/generate-synchronicity-insights";
import { EventEntryForm } from "@/components/event-entry-form";
import { InsightCard } from "@/components/insight-card";
import { Sparkles } from "lucide-react";

export default function Home() {
  const [currentInsight, setCurrentInsight] =
    useState<GenerateSynchronicityInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-2">
          Record a Synchronicity
        </h1>
        <p className="text-muted-foreground mb-8">
          What meaningful coincidence has crossed your path today? Capture the
          details to uncover hidden patterns.
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
              Generating insight...
            </p>
          </div>
        ) : currentInsight ? (
          <InsightCard insight={currentInsight.insight} />
        ) : (
          <div className="text-center">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="font-headline text-2xl mt-4 text-muted-foreground">
              Your insight will appear here
            </p>
            <p className="text-sm mt-2 text-muted-foreground/80 max-w-sm">
              Fill out the form and our AI will provide an interpretation of your synchronicity event.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}