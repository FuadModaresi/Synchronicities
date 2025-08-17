
import type { Metadata } from "next";
import { EventsProvider } from "@/context/events-provider";
import { AuthProvider } from "@/context/auth-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synchronicities",
  description: "Capture, analyze, and find meaning in life's meaningful coincidences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
       <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <AuthProvider>
            <EventsProvider>
              <MainLayout>{children}</MainLayout>
              <Toaster />
            </EventsProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
