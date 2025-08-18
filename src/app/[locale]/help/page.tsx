
"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Home, LayoutDashboard, BrainCircuit, BarChart3 } from "lucide-react";

export default function HelpPage() {
  const t = useTranslations('HelpPage');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          {t('description')}
        </p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Sparkles className="w-6 h-6 text-primary"/>
                {t('welcomeTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>{t('welcomeParagraph1')}</p>
            <p>{t('welcomeParagraph2')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Home className="w-6 h-6 text-primary"/>
                {t('eventEntryTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <p>{t('eventEntryParagraph1')}</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>{t('eventEntryItem1Title')}</strong>: {t('eventEntryItem1Desc')}</li>
              <li><strong>{t('eventEntryItem2Title')}</strong>: {t('eventEntryItem2Desc')}</li>
              <li><strong>{t('eventEntryItem3Title')}</strong>: {t('eventEntryItem3Desc')}</li>
              <li><strong>{t('eventEntryItem4Title')}</strong>: {t('eventEntryItem4Desc')}</li>
            </ul>
             <p>{t('eventEntryParagraph2')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <LayoutDashboard className="w-6 h-6 text-primary"/>
                {t('dashboardTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
             <p>{t('dashboardParagraph1')}</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong><BarChart3 className="inline w-4 h-4 mr-1"/>{t('dashboardItem1Title')}</strong>: {t('dashboardItem1Desc')}</li>
              <li><strong><BrainCircuit className="inline w-4 h-4 mr-1"/>{t('dashboardItem2Title')}</strong>: {t('dashboardItem2Desc')}</li>
              <li><strong>{t('dashboardItem3Title')}</strong>: {t('dashboardItem3Desc')}</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                {t('benefitsTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-foreground/90">
            <ul className="list-disc list-inside space-y-2">
                <li>{t('benefitsItem1')}</li>
                <li>{t('benefitsItem2')}</li>
                <li>{t('benefitsItem3')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
