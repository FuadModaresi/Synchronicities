
"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music4, Wind } from "lucide-react";

export default function ZenSpherePage() {
  const t = useTranslations('ZenSpherePage');
  
  const tracks = [
    {
      title: "Peaceful Meditation",
      artist: "Serenity Flows",
      src: "https://storage.googleapis.com/studioprototype-bucket/peaceful-meditation.mp3",
    },
    {
      title: "Morning Calm",
      artist: "Aura Sounds",
      src: "https://storage.googleapis.com/studioprototype-bucket/morning-calm.mp3"
    },
    {
        title: "Forest Stream",
        artist: "Nature's Whisper",
        src: "https://storage.googleapis.com/studioprototype-bucket/forest-stream.mp3"
    }
  ];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <Wind className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-3xl md:text-5xl font-bold text-foreground mb-2">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
          {t('description')}
        </p>
      </header>

      <div className="max-w-md mx-auto space-y-4">
        {tracks.map((track, index) => (
            <Card key={index}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Music4 className="w-5 h-5 text-primary/80"/>
                        {track.title}
                    </CardTitle>
                    <CardDescription>{t('artistLabel')}: {track.artist}</CardDescription>
                </CardHeader>
                <CardContent>
                    <audio controls className="w-full">
                        <source src={track.src} type="audio/mpeg"/>
                        Your browser does not support the audio element.
                    </audio>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
