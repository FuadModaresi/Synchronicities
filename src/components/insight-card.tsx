"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface InsightCardProps {
  insight: string;
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <Card className="w-full max-w-md bg-accent/50 animate-in fade-in zoom-in-95">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">AI Insight</CardTitle>
        </div>
        <CardDescription>
          Here's a potential meaning behind your experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 text-base leading-relaxed">
          {insight}
        </p>
      </CardContent>
    </Card>
  );
}
