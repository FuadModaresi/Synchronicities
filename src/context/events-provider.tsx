
"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useCallback } from "react";
import type { SynchronicityEvent } from "@/lib/types";

interface EventsContextType {
  events: SynchronicityEvent[];
  addEvent: (event: Omit<SynchronicityEvent, "id">) => void;
}

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<SynchronicityEvent[]>([]);

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
