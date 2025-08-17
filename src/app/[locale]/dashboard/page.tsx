
"use client";

import { DashboardClient } from "@/components/dashboard-client";
import {useTranslations} from 'next-intl';
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "../../../navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const t = useTranslations('DashboardPage');
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Temporarily disable redirection to allow UI to be seen without real auth
      // router.replace('/login');
    }
  }, [user, loading, router]);

  // if (loading || !user) {
  //   return (
  //       <div className="flex items-center justify-center h-screen">
  //           <div>Loading...</div>
  //       </div>
  //   )
  // }

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
