import type { Metadata } from "next";
import { EventsProvider } from "@/context/events-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "./globals.css";

export const metadata: Metadata = {
  title: "Synchronicities",
  description: "Capture, analyze, and find meaning in life's meaningful coincidences.",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=PT+Sans:wght@400;700&family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <EventsProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster />
          </EventsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
