
"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/hooks/use-events";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  const tToast = useTranslations('Toasts');
  const { events, clearEvents } = useEvents();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleExportClick = () => {
    if (events.length === 0) {
      toast({
        title: tToast('exportErrorTitle'),
        description: tToast('exportErrorDescription'),
        variant: "destructive",
      });
      return;
    }
    
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(events, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "synchronicities_export.json";
    link.click();
    toast({
        title: tToast('exportSuccessTitle'),
        description: tToast('exportSuccessDescription'),
    });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    clearEvents();
    toast({
      title: tToast('deleteSuccessTitle'),
      description: tToast('deleteSuccessDescription'),
    });
    setIsDeleting(false);
  };

  if (!isClient) {
    return null; 
  }

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

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
         <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">{t('dataManagementTitle')}</CardTitle>
                <CardDescription>{t('dataManagementDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={handleExportClick} variant="outline" className="w-full justify-start gap-2">
                    <FileDown className="w-4 h-4" />
                    <span>{t('exportButton')}</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                     <Button variant="destructive" className="w-full justify-start gap-2">
                        <Trash2 className="w-4 h-4" />
                        <span>{t('deleteButton')}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle/>{t('deleteConfirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('deleteConfirmDescription')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {t('confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

            </CardContent>
        </Card>
      </div>
    </div>
  );
}
