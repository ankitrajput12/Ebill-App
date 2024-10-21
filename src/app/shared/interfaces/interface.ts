export interface Organizer {
    organizerName: string;
    contact: string;
    email: string;
    organization: string;
  }
  
  export interface Event {
   id: string,
    name: string;
    time: string;
    organizer: Organizer;
    price: number;
    description: string;
    totalTickets:number;
    imageUrl?: string;
  }

  export interface RegistrationData {
    name: string;
    phone: string;
    eventTime: string;
    eventName: string | undefined;
    tickets: number;
    id: string;
  }
 