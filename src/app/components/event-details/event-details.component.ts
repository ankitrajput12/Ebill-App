import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Event } from '../../shared/interfaces/interface';
import { Router } from '@angular/router';
import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [DatePipe, CommonModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent {
  events: Event[] = [];

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
  }


  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      const savedEvents = localStorage.getItem('events');
      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      } else {
        this.initializeDefaultEvents();
        localStorage.setItem('events', JSON.stringify(this.events));
      }
    } else {
      this.events = []; // Handle the absence of localStorage
    }

  }

  private initializeDefaultEvents(): void {
    this.events = [
      {
        id: '1',
        name: 'Music Concert',
        time: '7:00 PM',
        organizer: {
          organizerName: 'Harmony Events',
          contact: '1234567890',
          email: 'harmony@example.com',
          organization: 'Harmony Productions'
        },
        price: 50,
        description: 'Join us for an evening of spectacular music and entertainment.',
        totalTickets: 100,
        imageUrl: 'assets/aa.avif' // Example image URL
      },
      {
        id: '2',
        name: 'Jazz Festival',
        time: '11:00 AM',
        organizer: {
          organizerName: 'Jazz Nights Ltd.',
          contact: '9876543210',
          email: 'jazznights@example.com',
          organization: 'Jazz Nights Ltd.'
        },
        price: 75,
        description: 'Enjoy the smooth sounds of jazz at our annual festival.',
        totalTickets: 150,
        imageUrl: 'assets/jazz.jpg' // Example image URL
      },
      {
        id: '3',
        name: 'Rock Extravaganza',
        time: '9:00 PM',
        organizer: {
          organizerName: 'Rock Revolution',
          contact: '3456789012',
          email: 'rockrevolution@example.com',
          organization: 'Rock Revolution Inc.'
        },
        price: 60,
        description: 'A night filled with high-energy rock performances from top bands.',
        totalTickets: 200,
        imageUrl: 'assets/rock.jpg' // Example image URL
      },
      {
        id: '4',
        name: 'Classical Symphony',
        time: '6:00 PM',
        organizer: {
          organizerName: 'Grand Symphony Society',
          contact: '2345678901',
          email: 'grandsymphony@example.com',
          organization: 'Grand Symphony Society'
        },
        price: 80,
        description: 'Experience a magical evening of classical music by renowned symphony orchestras.',
        totalTickets: 250,
        imageUrl: 'assets/classic.jpg' // Example image URL
      },
      {
        id: '5',
        name: 'Electronic Dance Night',
        time: '10:00 PM',
        organizer: {
          organizerName: 'Electro Beats Inc.',
          contact: '5678901234',
          email: 'electrobeats@example.com',
          organization: 'Electro Beats Inc.'
        },
        price: 70,
        description: 'Dance the night away with electrifying beats and top DJs.',
        totalTickets: 180,
        imageUrl: 'assets/electric.jpg' // Example image URL
      },
      {
        id: '6',
        name: 'Folk Music Fiesta',
        time: '5:00 PM',
        organizer: {
          organizerName: 'Folk Music Collective',
          contact: '6789012345',
          email: 'folkmusic@example.com',
          organization: 'Folk Music Collective'
        },
        price: 45,
        description: 'Enjoy a vibrant celebration of folk music and culture.',
        totalTickets: 120,
        imageUrl: 'assets/folk.jpg' // Example image URL
      }
    ];
  }

  onCardClick(event: Event): void {
    console.log('Event object:', event);
    if (event.id) {
      this.router.navigate(['/registrationpage', event.id]);
    } else {
      console.error('Event ID is undefined or null');
    }
  }
  
}
