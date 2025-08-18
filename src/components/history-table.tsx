
"use client";

import type { SynchronicityEvent } from "@/lib/types";
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


interface HistoryTableProps {
  events: SynchronicityEvent[];
}

export function HistoryTable({ events }: HistoryTableProps) {
  const t = useTranslations('HistoryTable');
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

  return (
    <Card>
      <Accordion type="single" collapsible className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t('number')}</TableHead>
              <TableHead>{t('date')}</TableHead>
              <TableHead>{t('location')}</TableHead>
              <TableHead>{t('emotion')}</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        {events.map((event) => (
          <AccordionItem value={event.id} key={event.id}>
             <Table>
                <TableBody>
                    <TableRow>
                        <TableCell className="w-[100px] font-medium">
                            <Badge variant="secondary">{event.number}</Badge>
                        </TableCell>
                        <TableCell>{format(new Date(event.date), "PP")} at {event.time}</TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{event.emotionalState}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <AccordionTrigger className="[&>svg]:ml-2"/>
                        </TableCell>
                    </TableRow>
                </TableBody>
             </Table>
            <AccordionContent>
              <div className="bg-muted/50 p-4 -mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-4 md:col-span-2">
                        {event.insight && <div>
                            <h4 className="font-semibold mb-2">{t('aiInsight')}</h4>
                            <p className="text-sm text-muted-foreground">{event.insight}</p>
                        </div>}
                        {event.myInterpretation && <div>
                            <h4 className="font-semibold mb-2">{t('myInterpretation')}</h4>
                            <p className="text-sm text-muted-foreground">{event.myInterpretation}</p>
                        </div>}
                    </div>
                    <div className="space-y-2">
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
                 {event.photoDataUri && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">{t('photo')}</h4>
                        <img src={event.photoDataUri} alt="Synchronicity event" className="rounded-lg max-w-xs border shadow-sm"/>
                    </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Card>
  );
}
