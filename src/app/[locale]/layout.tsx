import type { Metadata } from "next";
import { EventsProvider } from "@/context/events-provider";
import { AuthProvider } from "@/context/auth-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { getMessages, unstable_setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: "Synchronicities",
  description: "Capture, analyze, and find meaning in life's meaningful coincidences.",
};

const locales = ['en', 'fa'];

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
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=PT+Sans:wght@400;700&family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <EventsProvider>
              <MainLayout>{children}</MainLayout>
              <Toaster />
            </EventsProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
