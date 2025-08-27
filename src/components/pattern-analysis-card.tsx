
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";

interface PatternAnalysisCardProps {
  analysis: string;
}

export function PatternAnalysisCard({ analysis }: PatternAnalysisCardProps) {
  const t = useTranslations('PatternAnalysisCard');
  return (
    <Card className="w-full max-w-md bg-accent/50 animate-in fade-in zoom-in-95 mt-6">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <History className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">{t('title')}</CardTitle>
        </div>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 text-base leading-relaxed">
          {analysis}
        </p>
      </CardContent>
    </Card>
  );
}
