import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import jwt_decode from "jwt-decode";
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';

class DecodedToken {
  exp: number = 0;
  username: string = '';
}

@Injectable()
export class AuthService {
  private decodedToken: any;

  constructor(private http: HttpClient) { 
     const storedMeta = localStorage.getItem('bwm_meta');
      this.decodedToken = storedMeta ? JSON.parse(storedMeta) : new DecodedToken();
  }



  //this is new function for token
  private saveToken(token: any): string {
    this.decodedToken = jwt_decode(token);
    localStorage.setItem('bwm_auth', token);
    localStorage.setItem('bwm_meta', JSON.stringify(this.decodedToken));
    return token;
  }

 /*  private getExpiration() {
    return moment.unix(this.decodedToken.exp);
  } */

  private getExpiration() {
    if (this.decodedToken && this.decodedToken.exp) {
        return moment.unix(this.decodedToken.exp);
    } else {
        return null; // or a default value
    }
}


  public register(userData: any): Observable<any> {
    return this.http.post('api/v1/users/register', userData);
  }

  public login(userData: any): Observable<any> {
    return this.http.post('api/v1/users/auth', userData).pipe(
      map(token => this.saveToken(token))
    );
  }


  public logout() {
    localStorage.removeItem('bwm_auth');
    localStorage.removeItem('bwm_meta');

    //this.decodedToken = new this.decodedToken();
    this.decodedToken = null;
  }



    public isAuthenticated(): boolean {
      return moment().isBefore(this.getExpiration());
  }

  public getAuthToken(): string | null {
    return localStorage.getItem('bwm_auth');
  }

  
  public getUsername(): string {
    return this.decodedToken.username;
  }
  
  public getUserId(): string {
    return this.decodedToken.userId;
  }
}
