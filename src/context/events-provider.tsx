
"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useCallback, useEffect } from "react";
import type { SynchronicityEvent } from "@/lib/types";

const LOCAL_STORAGE_KEY = "synchronicities_events";

interface EventsContextType {
  events: SynchronicityEvent[];
  addEvent: (event: Omit<SynchronicityEvent, "id">) => void;
  updateEvent: (updatedEvent: SynchronicityEvent) => void;
  clearEvents: () => void;
}

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<SynchronicityEvent[]>([]);

  // Effect to load events from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (item) {
          setEvents(JSON.parse(item));
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to parse events from localStorage", error);
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }, []);

  // Effect to save events to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
        } catch (error) {
            console.error("Failed to save events to localStorage", error);
        }
    }
  }, [events]);

  const addEvent = useCallback((event: Omit<SynchronicityEvent, "id">) => {
    setEvents((prevEvents) => [
      { ...event, id: new Date().toISOString() },
      ...prevEvents,
    ]);
  }, []);

  const updateEvent = useCallback((updatedEvent: SynchronicityEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  }, []);
  
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);


  return (
    <EventsContext.Provider value={{ events, addEvent, updateEvent, clearEvents }}>
      {children}
    </EventsContext.Provider>
  );
}
