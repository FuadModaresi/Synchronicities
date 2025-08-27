
"use client";

import { DashboardClient } from "@/components/dashboard-client";
import {useTranslations} from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('description')}
        </p>
      </header>
      <DashboardClient />
    </div>
  );
}
