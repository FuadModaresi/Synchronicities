
"use client";

import type { ReactNode } from "react";
import React, { createContext, useState, useCallback, useEffect } from "react";
import type { SynchronicityEvent } from "@/lib/types";
import { useAuth } from "./auth-provider";

interface EventsContextType {
  events: SynchronicityEvent[];
  addEvent: (event: Omit<SynchronicityEvent, "id">) => void;
  clearEvents: () => void;
}

export const EventsContext = createContext<EventsContextType | undefined>(
  undefined
);

export function EventsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<SynchronicityEvent[]>([]);

  // Effect to load events from localStorage when the component mounts or user changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      try {
        const item = window.localStorage.getItem(`events_${user.uid}`);
        if (item) {
          setEvents(JSON.parse(item));
        } else {
          setEvents([]); // Clear events if no stored data for this user
        }
      } catch (error) {
        console.error("Failed to parse events from localStorage", error);
        setEvents([]);
      }
    } else {
      setEvents([]); // Clear events if no user
    }
  }, [user]);

  // Effect to save events to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
        try {
            window.localStorage.setItem(`events_${user.uid}`, JSON.stringify(events));
        } catch (error) {
            console.error("Failed to save events to localStorage", error);
        }
    }
  }, [events, user]);

  const addEvent = useCallback((event: Omit<SynchronicityEvent, "id">) => {
    setEvents((prevEvents) => [
      { ...event, id: new Date().toISOString() },
      ...prevEvents,
    ]);
  }, []);
  
  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);


  return (
    <EventsContext.Provider value={{ events, addEvent, clearEvents }}>
      {children}
    </EventsContext.Provider>
  );
}
