import { Component, OnInit, Input, ɵpublishDefaultGlobalUtils, ViewContainerRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Booking } from 'src/app/booking/shared/booking.model';
import { HelperService } from 'src/app/common/service/helper.service';
import { BookingService } from '../../../booking/shared/booking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { AuthService } from 'src/app/auth/shared/auth.service';
import * as moment from 'moment';
import { Tmer } from '../../shared/tmer.model';
import { error } from 'jquery';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'bwm-tmer-detail-booking',
  templateUrl: './tmer-detail-booking.component.html',
  styleUrls: ['./tmer-detail-booking.component.scss']
})
export class TmerDetailBookingComponent implements OnInit{

  @ViewChild(DaterangepickerComponent) private picker: DaterangepickerComponent | undefined;

 
  
  //@Input() price: number | undefined;
  @Input() tmer: Tmer | undefined;
  //@Input() bookings: Booking[];
  newBooking: Booking;
  modalRef: any;
  
  public daterange: any = {};
  bookedOutDates: any[] = [];
  errors: any[] = [];


   public options: any = {
     locale: { format: Booking.DATE_FORMAT },
     alwaysShowCalendars: false,
     opens: 'left',
     autoUpdateInput: false,
     isInvalidDate: this.checkForInvalidDates.bind(this)
  };

  constructor(private helper: HelperService,
              private modalService: NgbModal,
              private bookingService: BookingService,
              private toastr: ToastrService,
              private vcr: ViewContainerRef,
              public auth:AuthService) { 
                
                this.errors = [];
                //this.toastr.overlayContainer = this.vcr;
              }
  



  ngOnInit(): void {
    
    this.newBooking = new Booking();
    this.getBookedOutDates();
    this.errors = [];
   
  
    
    }
  
  private checkForInvalidDates(date: any) {
    
    return this.bookedOutDates.includes(this.helper.formatBookingDate(date)) || date.diff(moment(), 'days') < 0;
    
  }
  
  
  //check is the date was already taken
  private getBookedOutDates() {
    const bookings: Booking[] = this.tmer?.bookings || [];

      if(bookings && bookings.length > 0) {
        bookings.forEach((booking: Booking) => {
          //this.helper.getRangeOfDates(booking.startAt, booking.endAt);
          const dateRange = this.helper.getBookingRangeOfDates(booking.startAt, booking.endAt);
          //I used ... because I don;t want array inside array
          this.bookedOutDates.push(...dateRange);
          
      });
    }
  }

  private addNewBookedDates(bookingData:any) {
    const dateRange = this.helper.getBookingRangeOfDates(bookingData.startAt, bookingData.endAt);
    this.bookedOutDates.push(...dateRange);
  }

  private resetDatePicker() {
    this.picker?.datePicker.setStartDate(moment());
    this.picker?.datePicker.setEndDate(moment());
    this.picker?.datePicker.element.val('');
  }
  
  openConfirmModal(content: any) {
    this.errors = [];
    this.modalRef = this.modalService.open(content);
    
   
  }

createBooking() {
  console.log('Before createBooking - errors:', this.errors);

  this.newBooking.tmer = this.tmer;
  this.bookingService.createBooking(this.newBooking).subscribe(
    (bookingData: any) => {
      this.addNewBookedDates(bookingData);
      this.newBooking = new Booking();
      this.modalRef.close();
      this.resetDatePicker();
      this.toastr.success('Booking has been created, please check your booking detail in manage section', 'Success');

      
    },
    (errorResponse: any) => {
      console.log('Error response:', errorResponse);
      if (errorResponse.status === 422) {
        // Validation error, update errors array
        this.errors = errorResponse.error.errors || [];
      } else {
        // Handle other types of errors if needed
        console.error('Unexpected error:', errorResponse);
      }

      console.log('After createBooking error - errorResponse:', errorResponse);
     
    },
    () => {
      console.log('After createBooking - completed - errors:', this.errors);
    }
  );
}



/* 
createBooking() {
  console.log('Before createBooking - errors:', this.errors);

  this.newBooking.tmer = this.tmer;
  this.bookingService.createBooking(this.newBooking).subscribe(
    (bookingData: any) => {
      this.addNewBookedDates(bookingData);
      this.newBooking = new Booking();
      this.modalRef.close();
      console.log('After createBooking success - errors:', this.errors);
    },
    (errorResponse: any) => {
      this.errors = errorResponse.error.errors || [];
      console.log('After createBooking error - errors:', this.errors);
    },
    () => {
      console.log('After createBooking - completed - errors:', this.errors);
    }
  );
} */



 /*  createBooking() {
    //console.log(this.newBooking);
    
    this.newBooking.tmer = this.tmer;
    this.bookingService.createBooking(this.newBooking).subscribe(
      (bookingData:any) => {
        this.addNewBookedDates(bookingData);
        this.newBooking = new Booking();
        this.modalRef.close();
      },
      (errorResponse: any) => {
        this.errors = errorResponse.error.errors;
      })
  } */
 
  public selectedDate(value: any, datepicker?: any) {
    
 
    // any object can be passed to the selected event and it will be passed back here
    /* datepicker.start = value.start;
    datepicker.end = value.end; */
    this.options.autoUpdateInput = true;
    this.newBooking.startAt = this.helper.formatBookingDate(value.start);
    this.newBooking.endAt = this.helper.formatBookingDate(value.end);
    this.newBooking.days = -(value.start.diff(value.end, 'days'));
    this.newBooking.totalPrice = this.newBooking.days * (this.tmer?.dailyRate ?? 0);

 
 
    // use passed valuable to update state
   /*  this.daterange.start = value.start;
    this.daterange.end = value.end;
    this.daterange.label = value.label; */
  }


}
