
"use client";

import type { GenerateSynchronicityInsightsOutput } from "@/ai/flows/generate-synchronicity-insights";
import { generateSynchronicityInsights } from "@/ai/flows/generate-synchronicity-insights";
import { useEvents } from "@/hooks/use-events";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  Image as ImageIcon,
  Loader2,
  MapPin,
  PlusCircle,
  Smile,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import React from "react";
import { useTranslations } from "next-intl";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
  
const useFormSchema = () => {
    const t = useTranslations('EventForm');
    return z.object({
        number: z.coerce
          .number({ required_error: t('numberRequired') })
          .min(0, t('numberPositive')),
        date: z.date({ required_error: t('dateRequired') }),
        time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('invalidTime')),
        location: z.string().min(1, t('locationRequired')),
        emotionalState: z.string().min(1, t('emotionalStateRequired')),
        photo: z.any().optional(),
        peoplePresent: z.string().optional(),
        additionalDetails: z.string().optional(),
      });
}

type FormValues = z.infer<ReturnType<typeof useFormSchema>>;
  
interface EventEntryFormProps {
  onInsightGenerated: (insight: GenerateSynchronicityInsightsOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}


export function EventEntryForm({ onInsightGenerated, setIsLoading, isLoading }: EventEntryFormProps) {
  const t = useTranslations('EventForm');
  const tToast = useTranslations('Toasts');
  const formSchema = useFormSchema();

  const { addEvent } = useEvents();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: undefined,
      date: new Date(),
      time: format(new Date(), "HH:mm"),
      location: "",
      emotionalState: "",
      peoplePresent: "",
      additionalDetails: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    onInsightGenerated(null);

    let photoDataUri: string | undefined = undefined;
    if (values.photo && values.photo[0]) {
      try {
        photoDataUri = await toBase64(values.photo[0]);
      } catch (error) {
        console.error("Error converting file to base64", error);
        toast({
          title: "Error",
          description: tToast('imageError'),
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
    }

    const inputForAI = {
      ...values,
      date: format(values.date, "yyyy-MM-dd"),
      photoDataUri,
    };

    try {
      const result = await generateSynchronicityInsights(inputForAI);
      onInsightGenerated(result);
      addEvent({ ...inputForAI, insight: result.insight });
      toast({
        title: tToast('eventRecordedTitle'),
        description: tToast('eventRecordedDescription'),
      });
      form.reset({
        ...form.getValues(),
        number: undefined,
        location: '',
        emotionalState: '',
        peoplePresent: '',
        additionalDetails: '',
        photo: undefined,
      });
    } catch (error) {
      console.error("Error generating insight:", error);
      onInsightGenerated(null);
      toast({
        title: tToast('aiErrorTitle'),
        description: tToast('aiErrorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('numberLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" placeholder={t('numberPlaceholder')} {...field} className="pl-9" value={field.value ?? ''} onChange={e => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('dateLabel')}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>{t('pickDate')}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('timeLabel')}</FormLabel>
                <FormControl>
                   <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="time" {...field} className="pl-9" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('locationLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('locationPlaceholder')} {...field} className="pl-9"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="emotionalState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('emotionalStateLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('emotionalStatePlaceholder')} {...field} className="pl-9"/>
                </div>
              </FormControl>
              <FormDescription>
                {t('emotionalStateDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('photoLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="file" accept="image/*" {...form.register("photo")} className="pl-9 pt-2 text-sm"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="peoplePresent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('peoplePresentLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder={t('peoplePresentPlaceholder')} {...field} className="pl-9"/>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="additionalDetails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('additionalDetailsLabel')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('additionalDetailsPlaceholder')}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          {isLoading ? t('submitButtonLoading') : t('submitButton')}
        </Button>
      </form>
    </Form>
  );
}
