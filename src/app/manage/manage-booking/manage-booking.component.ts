import { Component, OnInit } from '@angular/core';
import { Booking } from 'src/app/booking/shared/booking.model';
import { PaymentService } from 'src/app/payment/share/payment.service';
import { BookingService } from 'src/app/booking/shared/booking.service';

@Component({
  selector: 'app-manage-booking',
  templateUrl: './manage-booking.component.html',
  styleUrls: ['./manage-booking.component.scss'],
})
export class ManageBookingComponent implements OnInit {
  bookings: Booking[];
  payments: any[];
  loading: { [paymentId: string]: boolean } = {};

  constructor(
    private bookingService: BookingService,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.bookingService.getUserBookings().subscribe(
      (bookings: Booking[]) => {
        this.bookings = bookings;
      },
      (errorResponse: any) => {
        console.error('Error fetching bookings:', errorResponse);
      }
    );

    this.getPendingPayments();
  }

  getPendingPayments() {
    this.paymentService.getPendingPayment().subscribe(
      (payments: any) => {
        this.payments = payments;
      },
      () => {}
    );
  }

  acceptPayment(payment: any) {
    this.loading[payment._id] = true; // Set loading to true for this payment
    this.paymentService.acceptPayment(payment).subscribe(
      (response) => {
        console.log('Payment accepted:', response);
        payment.status = response.status;
        this.getPendingPayments(); // Refresh the list
        this.loading[payment._id] = false; // Set loading back to false
      },
      (errorResponse: any) => {
        console.error('Error accepting payment:', errorResponse);
        this.loading[payment._id] = false; // Ensure loading is false on error
      }
    );
  }

  /*  acceptPayment(payment: any) {
    this.paymentService.acceptPayment(payment).subscribe(
      (response) => {
        console.log('Payment accepted:', response);

        // ✅ Update payment status in UI
        payment.status = response.status;

        // ✅ Refresh the list of pending payments
        this.getPendingPayments();
      },
      (errorResponse: any) => {
        console.error('Error accepting payment:', errorResponse);
      }
    );
  } */

  declinePayment(payment: any) {
    this.paymentService.declinePayment(payment).subscribe(
      (response) => {
        console.log('Payment accepted:', response);

        // ✅ Update payment status in UI
        payment.status = response.status;

        // ✅ Refresh the list of pending payments
        this.getPendingPayments();
      },
      (errorResponse: any) => {
        console.error('Error accepting payment:', errorResponse);
      }
    );
  }
}
