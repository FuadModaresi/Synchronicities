
"use client";

import { DashboardClient } from "@/components/dashboard-client";
import { useAuth } from "@/context/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div>Loading...</div>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-foreground mb-2">
          Your Pattern Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover the connections and rhythms in your synchronicity journal.
        </p>
      </header>
      <DashboardClient />
    </div>
  );
}
