export interface SynchronicityEvent {
  id: string;
  number: number;
  date: string;
  time: string;
  location: string;
  emotionalState: string;
  photoDataUri?: string;
  peoplePresent?: string;
  additionalDetails?: string;
  insight?: string;
}
