
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-provider";
import { useEvents } from "@/hooks/use-events";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, FileDown, Trash2, AlertTriangle } from "lucide-react";
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
  const { user } = useAuth();
  const router = useRouter();
  const { events, clearEvents } = useEvents();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // State to trigger export
  const [shouldExport, setShouldExport] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side
    if (shouldExport) {
      if (events.length === 0) {
        toast({
          title: tToast('exportErrorTitle'),
          description: tToast('exportErrorDescription'),
          variant: "destructive",
        });
      } else {
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
      }
      // Reset the trigger
      setShouldExport(false);
    }
  }, [shouldExport, events, toast, tToast]);

  if (!user) {
    router.replace('/login');
    return null;
  }
  
  const handleExportClick = () => {
    // Trigger the effect to run on the client
    setShouldExport(true);
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
            <CardHeader className="flex flex-row items-center gap-4">
                 <Avatar className="h-16 w-16">
                    <AvatarImage src={user.photoURL ?? ""} alt={user.displayName ?? 'user'} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl">{user.displayName}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                </div>
            </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground">{t('profileDescription')}</p>
            </CardContent>
        </Card>

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
