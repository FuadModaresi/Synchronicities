"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useCallback } from "react";
import type { SynchronicityEvent } from "@/lib/types";
import { format } from "date-fns";

// Mock Data
const mockEvents: SynchronicityEvent[] = [
  {
    id: "1",
    number: 1111,
    date: format(new Date(2023, 10, 11), "yyyy-MM-dd"),
    time: "11:11",
    location: "Cafe",
    emotionalState: "Curious",
    insight: "A reminder of alignment and a signal to pay attention to your thoughts.",
  },
  {
    id: "2",
    number: 444,
    date: format(new Date(2023, 11, 4), "yyyy-MM-dd"),
    time: "16:44",
    location: "Park",
    emotionalState: "Peaceful",
    insight: "You are on the right path and your angels are guiding you.",
  },
  {
    id: "3",
    number: 888,
    date: format(new Date(), "yyyy-MM-dd"),
    time: "08:08",
    location: "Work",
    emotionalState: "Stressed",
    insight: "Abundance is on its way. Stay positive and open to receiving.",
  },
  {
    id: "4",
    number: 1111,
    date: format(new Date(), "yyyy-MM-dd"),
    time: "23:11",
    location: "Home",
    emotionalState: "Grateful",
    insight: "Keep your thoughts positive, you are manifesting your desires quickly.",
  }
];

interface EventsContextType {
  events: SynchronicityEvent[];
  addEvent: (event: Omit<SynchronicityEvent, "id">) => void;
}

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<SynchronicityEvent[]>(mockEvents);

  const addEvent = useCallback((event: Omit<SynchronicityEvent, "id">) => {
    setEvents((prevEvents) => [
      { ...event, id: new Date().toISOString() },
      ...prevEvents,
    ]);
  }, []);

  return (
    <EventsContext.Provider value={{ events, addEvent }}>
      {children}
    </EventsContext.Provider>
  );
}