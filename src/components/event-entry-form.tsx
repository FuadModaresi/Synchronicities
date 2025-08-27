
"use client";

import type { GenerateSynchronicityInsightsOutput } from "@/ai/flows/generate-synchronicity-insights";
import { generateSynchronicityInsights } from "@/ai/flows/generate-synchronicity-insights";
import type { GeneratePatternAnalysisOutput } from "@/ai/flows/generate-pattern-analysis";
import { generatePatternAnalysis } from "@/ai/flows/generate-pattern-analysis";
import { useEvents } from "@/hooks/use-events";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Camera,
  ChevronLeft,
  Clock,
  Image as ImageIcon,
  Loader2,
  MapPin,
  MessageSquareQuote,
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
import React, { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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
        number: z.string().min(1, t('numberRequired')),
        date: z.date({ required_error: t('dateRequired') }),
        time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, t('invalidTime')),
        location: z.string().min(1, t('locationRequired')),
        emotionalState: z.string().min(1, t('emotionalStateRequired')),
        photo: z.any().optional(),
        photoDataUri: z.string().optional(),
        peoplePresent: z.string().optional(),
        additionalDetails: z.string().optional(),
        myInterpretation: z.string().optional(),
      });
}

type FormValues = z.infer<ReturnType<typeof useFormSchema>>;
  
interface EventEntryFormProps {
  onInsightGenerated: (insight: GenerateSynchronicityInsightsOutput | null) => void;
  onPatternAnalysisGenerated: (analysis: GeneratePatternAnalysisOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
  setIsPatternLoading: (loading: boolean) => void;
}


export function EventEntryForm({ 
    onInsightGenerated,
    onPatternAnalysisGenerated,
    setIsLoading, 
    isLoading,
    setIsPatternLoading
}: EventEntryFormProps) {
  const t = useTranslations('EventForm');
  const tToast = useTranslations('Toasts');
  const locale = useLocale();
  const formSchema = useFormSchema();

  const { events, addEvent } = useEvents();
  const { toast } = useToast();
  
  const [isClient, setIsClient] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: "",
      date: new Date(),
      time: format(new Date(), "HH:mm"),
      location: "",
      emotionalState: "",
      peoplePresent: "",
      additionalDetails: "",
      myInterpretation: "",
      photo: undefined,
      photoDataUri: "",
    },
  });

   useEffect(() => {
    if (showCamera) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setHasCameraPermission(true);
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: tToast('cameraErrorTitle'),
            description: tToast('cameraErrorDescription'),
          });
        }
      };
      getCameraPermission();
    } else {
        // Stop camera stream when not shown
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [showCamera, tToast, toast]);


  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/png');
        setCapturedImage(dataUri);
        form.setValue('photoDataUri', dataUri);
        setShowCamera(false);
      }
    }
  };

  const handleLocation = () => {
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        form.setValue('location', `${latitude}, ${longitude}`);
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location", error);
        toast({
          title: tToast('locationErrorTitle'),
          description: tToast('locationErrorDescription'),
          variant: "destructive",
        });
        setLocationLoading(false);
      }
    );
  };


  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    onInsightGenerated(null);

    let photoDataUri: string | undefined = values.photoDataUri;
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
      locale,
    };

    try {
      // First, get the primary insight
      const result = await generateSynchronicityInsights(inputForAI);
      onInsightGenerated(result);
      
      const newEventWithInsight = { ...values, date: format(values.date, "yyyy-MM-dd"), photoDataUri, insight: result.insight };
      addEvent(newEventWithInsight);
      
      toast({
        title: tToast('eventRecordedTitle'),
        description: tToast('eventRecordedDescription'),
      });
      
      // Now, kick off the pattern analysis in the background
      setIsPatternLoading(true);
      const pastEventsForAnalysis = events.map(e => ({
          number: String(e.number),
          date: e.date,
          emotionalState: e.emotionalState,
          myInterpretation: e.myInterpretation,
          insight: e.insight,
      }));

      const patternResult = await generatePatternAnalysis({
        newEvent: inputForAI,
        pastEvents: pastEventsForAnalysis,
        locale,
      });
      onPatternAnalysisGenerated(patternResult);


      form.reset({
        ...form.getValues(),
        number: "",
        location: '',
        emotionalState: '',
        peoplePresent: '',
        additionalDetails: '',
        photo: undefined,
        myInterpretation: '',
        photoDataUri: '',
      });
      setCapturedImage(null);

    } catch (error) {
      console.error("Error during event submission process:", error);
      onInsightGenerated(null);
      onPatternAnalysisGenerated(null);
      toast({
        title: tToast('aiErrorTitle'),
        description: tToast('aiErrorDescription'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsPatternLoading(false);
    }
  }

  if (showCamera) {
    return (
        <Card>
            <CardContent className="p-4">
                <Button variant="ghost" size="sm" onClick={() => setShowCamera(false)} className="mb-4">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {t('backToForm')}
                </Button>
                <div className="space-y-4">
                    <video ref={videoRef} className="w-full aspect-video rounded-md bg-muted" autoPlay muted playsInline />
                    <canvas ref={canvasRef} className="hidden" />

                    {hasCameraPermission === false && (
                         <Alert variant="destructive">
                            <AlertTitle>{tToast('cameraErrorTitle')}</AlertTitle>
                            <AlertDescription>{tToast('cameraErrorDescription')}</AlertDescription>
                        </Alert>
                    )}

                    <Button onClick={handleCapture} disabled={!hasCameraPermission} className="w-full">
                        <Camera className="mr-2 h-4 w-4" />
                        {t('capturePhoto')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
  }
  
  if (!isClient) {
    return null; // Or a loading spinner
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
                  <Input type="text" placeholder={t('numberPlaceholder')} {...field} className="pl-9" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <div className="flex flex-col sm:flex-row gap-2">
                <FormControl>
                    <div className="relative flex-grow">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('locationPlaceholder')} {...field} className="pl-9"/>
                    </div>
                </FormControl>
                <Button type="button" variant="outline" onClick={handleLocation} disabled={locationLoading} className="sm:w-auto">
                    <MapPin className="h-4 w-4 sm:mr-2" />
                    <span className="sr-only sm:not-sr-only">{t('useMyLocation')}</span>
                     {locationLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                </Button>
              </div>
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
          name="myInterpretation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('myInterpretationLabel')}</FormLabel>
              <FormControl>
                <div className="relative">
                   <MessageSquareQuote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                   <Textarea
                    placeholder={t('myInterpretationPlaceholder')}
                    {...field}
                    className="pl-9"
                  />
                </div>
              </FormControl>
              <FormDescription>
                {t('myInterpretationDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-4">
            <FormLabel>{t('photoLabel')}</FormLabel>
            {capturedImage && (
                <div className="relative w-fit">
                    <img src={capturedImage} alt="Captured" className="rounded-md h-32 border" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 rounded-full h-6 w-6 p-1"
                        onClick={() => {
                            setCapturedImage(null);
                            form.setValue('photoDataUri', undefined);
                        }}
                    >
                        &times;
                    </Button>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="photo"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                             <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-center text-muted-foreground">
                                        <span className="font-semibold">{t('uploadTitle')}</span> {t('uploadDesc')}
                                    </p>
                                </div>
                                <Input 
                                    id="dropzone-file"
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            const file = e.target.files[0];
                                            toBase64(file).then(dataUri => {
                                                setCapturedImage(dataUri);
                                                form.setValue('photoDataUri', dataUri);
                                            });
                                        }
                                    }}
                                />
                            </label>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <button type="button" onClick={() => setShowCamera(true)} className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary">
                     <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-2" />
                        <p className="mb-2 text-sm text-center">
                            <span className="font-semibold">{t('useCamera')}</span>
                        </p>
                    </div>
                </button>
            </div>
        </div>

        
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
