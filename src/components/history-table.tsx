
"use client";

import React, { useState, useEffect } from 'react';
import type { SynchronicityEvent } from "@/lib/types";
import { useEvents } from '@/hooks/use-events';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Calendar, Clock, MapPin, Smile, PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';


interface EventDetailsProps {
    event: SynchronicityEvent;
    onSave: (interpretation: string) => void;
}

const EventDetails = ({ event, onSave }: EventDetailsProps) => {
    const t = useTranslations('HistoryTable');
    const [interpretation, setInterpretation] = useState(event.myInterpretation ?? '');

    const handleSaveClick = () => {
        onSave(interpretation);
    };

    return (
        <div className="bg-muted/50 p-4 -mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 md:col-span-2">
                    {event.insight && <div>
                        <h4 className="font-semibold mb-2">{t('aiInsight')}</h4>
                        <p className="text-sm text-muted-foreground bg-background/50 p-3 rounded-md">{event.insight}</p>
                    </div>}
                    
                    <div className="space-y-2">
                        <Label htmlFor={`interpretation-${event.id}`}>{t('myInterpretation')}</Label>
                        <Textarea
                            id={`interpretation-${event.id}`}
                            placeholder={t('myInterpretationPlaceholder')}
                            value={interpretation}
                            onChange={(e) => setInterpretation(e.target.value)}
                            className="bg-background"
                        />
                         <Button size="sm" onClick={handleSaveClick}>{t('saveInterpretation')}</Button>
                    </div>

                    {event.photoDataUri && (
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">{t('photo')}</h4>
                            <img src={event.photoDataUri} alt="Synchronicity event" className="rounded-lg max-w-full sm:max-w-xs border shadow-sm"/>
                        </div>
                    )}
                </div>
                <div className="space-y-4 bg-background/50 p-4 rounded-md">
                    {event.peoplePresent && <div>
                        <h4 className="font-semibold text-sm">{t('peoplePresent')}</h4>
                        <p className="text-sm text-muted-foreground">{event.peoplePresent}</p>
                    </div>}
                     {event.additionalDetails && <div>
                        <h4 className="font-semibold text-sm">{t('additionalDetails')}</h4>
                        <p className="text-sm text-muted-foreground">{event.additionalDetails}</p>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export function HistoryTable({ events }: { events: SynchronicityEvent[] }) {
    const t = useTranslations('HistoryTable');
    const tToast = useTranslations('Toasts');
    const { updateEvent } = useEvents();
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
    }, [])

    const handleSave = (event: SynchronicityEvent, interpretation: string) => {
        const updatedEvent = { ...event, myInterpretation: interpretation };
        updateEvent(updatedEvent);
        toast({
            title: tToast('eventUpdatedTitle'),
            description: tToast('eventUpdatedDescription'),
        });
    };
    
    if (!isClient) {
        return null;
    }

    if (events.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <h3 className="text-xl font-semibold">{t('noEventsTitle')}</h3>
                    <p className="text-muted-foreground mt-2">{t('noEventsDescription')}</p>
                </CardContent>
            </Card>
        )
    }

    if (isMobile) {
        return (
            <Accordion type="single" collapsible className="w-full space-y-4">
                {events.map((event) => (
                    <AccordionItem value={event.id} key={event.id} className="border rounded-lg bg-card">
                        <AccordionTrigger className="p-4 text-left hover:no-underline">
                            <div className="flex-1 space-y-2">
                               <div className="flex items-center gap-2">
                                     <PlusCircle className="w-4 h-4 text-primary" />
                                     <p className="font-bold text-lg">{event.number}</p>
                               </div>
                               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>{format(new Date(event.date), "PP")} at {event.time}</span>
                               </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                               </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Smile className="w-4 h-4 text-muted-foreground" />
                                     <Badge variant="outline">{event.emotionalState}</Badge>
                               </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <EventDetails event={event} onSave={(interpretation) => handleSave(event, interpretation)}/>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        )
    }

    return (
        <Card>
            <Accordion type="single" collapsible className="w-full">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[150px]">{t('number')}</TableHead>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('location')}</TableHead>
                    <TableHead>{t('emotion')}</TableHead>
                    <TableHead className="text-right w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                </Table>
                {events.map((event) => (
                <AccordionItem value={event.id} key={event.id}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className="w-[150px] font-medium">
                                    <Badge variant="secondary">{event.number}</Badge>
                                </TableCell>
                                <TableCell>{format(new Date(event.date), "PP")} at {event.time}</TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{event.emotionalState}</Badge>
                                </TableCell>
                                <TableCell className="text-right w-[50px]">
                                    <AccordionTrigger className="[&>svg]:ml-2"/>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <AccordionContent>
                        <EventDetails event={event} onSave={(interpretation) => handleSave(event, interpretation)}/>
                    </AccordionContent>
                </AccordionItem>
                ))}
            </Accordion>
        </Card>
    );
}
