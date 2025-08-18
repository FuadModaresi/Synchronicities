
"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Home, LayoutDashboard, BrainCircuit, BarChart3, Camera, MapPin, Edit, Star, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function HelpPage() {
  const t = useTranslations('HelpPage');
  const tToast = useTranslations('Toasts');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim() === '' && rating === 0) {
        toast({
            variant: 'destructive',
            title: t('feedbackErrorTitle'),
            description: t('feedbackErrorDescription'),
        });
        return;
    }
    console.log("Feedback submitted:", { rating, feedback });
    toast({
        title: t('feedbackSuccessTitle'),
        description: t('feedbackSuccessDescription'),
    });
    setRating(0);
    setFeedback("");
  };


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
              <li><strong><Camera className="inline w-4 h-4 mr-1"/>{t('eventEntryItem5Title')}</strong>: {t('eventEntryItem5Desc')}</li>
              <li><strong><MapPin className="inline w-4 h-4 mr-1"/>{t('eventEntryItem6Title')}</strong>: {t('eventEntryItem6Desc')}</li>
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
              <li><strong><Edit className="inline w-4 h-4 mr-1"/>{t('dashboardItem3Title')}</strong>: {t('dashboardItem3Desc')}</li>
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

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                    <MessageSquare className="w-6 h-6 text-primary"/>
                    {t('feedbackTitle')}
                </CardTitle>
                <CardDescription>{t('feedbackDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="font-medium text-sm mb-2 block">{t('ratingLabel')}</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Button
                                type="button"
                                key={star}
                                variant="ghost"
                                size="icon"
                                onClick={() => setRating(star)}
                                >
                                <Star
                                    className={cn(
                                    "w-6 h-6",
                                    rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                                    )}
                                />
                                </Button>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="feedback-message" className="font-medium text-sm mb-2 block">{t('messageLabel')}</label>
                        <Textarea
                            id="feedback-message"
                            placeholder={t('messagePlaceholder')}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <Button type="submit">{t('submitButton')}</Button>
                </form>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
