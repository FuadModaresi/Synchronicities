import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from "react";
import { EventsProvider } from "@/context/events-provider";
import { AuthProvider } from "@/context/auth-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import { locales } from "../../../navigation";

export const metadata: Metadata = {
  title: "Synchronicities",
  description: "Capture, analyze, and find meaning in life's meaningful coincidences.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <EventsProvider>
          <MainLayout>{children}</MainLayout>
          <Toaster />
        </EventsProvider>
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
