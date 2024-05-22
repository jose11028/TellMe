import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from './booking.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BookingService {

  constructor(private http:HttpClient) {}


  public createBooking(booking:Booking): Observable<any> {
    return this.http.post('/api/v1/bookings', booking);
  }

   public getUserBookings(): Observable<any> {
      return this.http.get('/api/v1/bookings/manage');
        }



}




 



/* import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from './booking.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../auth/shared/auth.service'; // Adjust the path accordingly

@Injectable()
export class BookingService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  public createBooking(booking: Booking): Observable<any> {
    // Get the authentication token from your authService
    const authToken = this.authService.getAuthToken();

    // Add the token to the request headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });

    // Make the POST request with headers
    return this.http.post('/api/v1/bookings', booking, { headers });
  }
}
 */