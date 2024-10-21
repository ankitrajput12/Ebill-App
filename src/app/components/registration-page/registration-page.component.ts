import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Event, RegistrationData } from '../../shared/interfaces/interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {
  personalInfoForm: FormGroup = <FormGroup>{};
  eventInfoForm: FormGroup = <FormGroup>{};
  paymentForm: FormGroup = <FormGroup>{};
  currentStep: number = 1;
  event: Event = <Event>{};
  pricePerTicket: number = 0;
  totalPrice: number = 0;
  registrationData: RegistrationData = <RegistrationData>{};


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('id');
      if (eventId) {
        this.event = this.getEventDetails(eventId);
        if (!this.event || !this.event.organizer) {
          console.error('Event object or organizer is missing');
          this.router.navigate(['/eventdetails']);
          return;
        }
        this.initializeForms();
      } else {
        console.error('Event ID is missing');
        this.router.navigate(['/eventdetails']);
      }
    });
  }

  private getEventDetails(eventId: string): Event {
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    return events.find((event: Event) => event.id === eventId) || {} as Event;
  }

  private initializeForms(): void {
    this.personalInfoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.eventInfoForm = this.fb.group({
      eventName: [{ value: this.event?.name, disabled: true }],
      eventTime: [{ value: this.event?.time, disabled: true }],
      tickets: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      price: [{ value: this.event?.price, disabled: true }],
      totalPrice: [{ value: 0, disabled: true }]
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required]
    });

    this.pricePerTicket = this.event?.price || 0;
  }

  nextStep(): void {
    if (this.currentStep === 1 && this.personalInfoForm.invalid) {
      this.personalInfoForm.markAllAsTouched();
    } else if (this.currentStep === 2 && this.eventInfoForm.invalid) {
      this.eventInfoForm.markAllAsTouched();
    } else if (this.currentStep === 3 && this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
    } else {
      this.currentStep++;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  calculatePrice(): void {
    const tickets = this.eventInfoForm.get('tickets')?.value || 0;
    this.totalPrice = tickets * this.pricePerTicket;
    this.eventInfoForm.get('totalPrice')?.setValue(this.totalPrice);
  }

  submit(): void {
    if (this.isFormValid() && this.areTicketsAvailable()) {
      this.updateEventTickets();
      this.saveRegistrationData();
      this.router.navigate(['/success']);
    } else {
      this.markAllFormsAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/eventdetails']);
  }

  private isFormValid(): boolean {
    return this.personalInfoForm.valid && this.eventInfoForm.valid && this.paymentForm.valid;
  }

  private areTicketsAvailable(): boolean {
    const ticketsRequested = this.eventInfoForm.get('tickets')?.value;
    if (this.event.totalTickets < ticketsRequested) {
      Swal.fire("SweetAlert2 is working!");
      return false;
    }
    return true;
  }

  private updateEventTickets(): void {
    const ticketsRequested = this.eventInfoForm.get('tickets')?.value;
    this.event.totalTickets -= ticketsRequested;
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    const eventIndex = events.findIndex((e: Event) => e.id === this.event.id);
    if (eventIndex !== -1) {
      events[eventIndex].totalTickets = this.event.totalTickets;
      localStorage.setItem('events', JSON.stringify(events));
    }
  }

  private saveRegistrationData(): void {
    const ticketsRequested = this.eventInfoForm.get('tickets')?.value;
    this.registrationData = {
      name: `${this.personalInfoForm.value.firstName} ${this.personalInfoForm.value.lastName}`,
      phone: this.personalInfoForm.value.mobileNo,
      eventTime: this.event.time,
      eventName: this.event.name,
      tickets: ticketsRequested,
      id: this.generateUniqueId()
    };

    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push(this.registrationData);
    localStorage.setItem('registrations', JSON.stringify(registrations));
    localStorage.setItem('registrationData', JSON.stringify(this.registrationData));
  }

  private markAllFormsAsTouched(): void {
    this.personalInfoForm.markAllAsTouched();
    this.eventInfoForm.markAllAsTouched();
    this.paymentForm.markAllAsTouched();
  }

  private generateUniqueId = (): string => 'REG' + Math.random().toString(36).substring(2, 9);
}
