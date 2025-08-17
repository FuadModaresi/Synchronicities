
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

const formSchema = z.object({
  number: z.coerce
    .number({ required_error: "A number or sign is required." })
    .min(0, "Number must be positive."),
  date: z.date({ required_error: "A date is required." }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  location: z.string().min(1, "Location is required."),
  emotionalState: z.string().min(1, "Emotional state is required."),
  photo: z.any().optional(),
  peoplePresent: z.string().optional(),
  additionalDetails: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EventEntryFormProps {
  onInsightGenerated: (insight: GenerateSynchronicityInsightsOutput | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export function EventEntryForm({ onInsightGenerated, setIsLoading, isLoading }: EventEntryFormProps) {
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
          description: "Could not process the image file.",
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
        title: "Event Recorded",
        description: "Your synchronicity and its insight have been saved.",
      });
      form.reset();
    } catch (error) {
      console.error("Error generating insight:", error);
      onInsightGenerated(null);
      toast({
        title: "AI Error",
        description: "Could not generate an insight for this event.",
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
              <FormLabel>Number / Sign</FormLabel>
              <FormControl>
                <div className="relative">
                  <PlusCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" placeholder="e.g., 1111, 444" {...field} className="pl-9" value={field.value ?? ''} />
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
                <FormLabel>Date</FormLabel>
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
                          <span>Pick a date</span>
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
                <FormLabel>Time</FormLabel>
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
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="e.g., At a coffee shop" {...field} className="pl-9"/>
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
              <FormLabel>Your Emotional State</FormLabel>
              <FormControl>
                <div className="relative">
                  <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="e.g., Hopeful, curious, stressed" {...field} className="pl-9"/>
                </div>
              </FormControl>
              <FormDescription>
                How were you feeling at that moment?
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
              <FormLabel>Optional Photo</FormLabel>
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
              <FormLabel>People Present (Optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="e.g., Friend, partner, stranger" {...field} className="pl-9"/>
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
              <FormLabel>Additional Details (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any other details? e.g., What were you thinking about?"
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
          {isLoading ? "Generating Insight..." : "Save & Generate Insight"}
        </Button>
      </form>
    </Form>
  );
}
