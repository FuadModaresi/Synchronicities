export interface SynchronicityEvent {
  id: string;
  number: string;
  date: string;
  time: string;
  location: string;
  emotionalState: string;
  photoDataUri?: string;
  peoplePresent?: string;
  additionalDetails?: string;
  insight?: string;
  myInterpretation?: string;
}
