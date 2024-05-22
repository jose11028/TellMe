import {Injectable} from '@angular/core';
import { Observable } from 'rxjs';
import { Tmer } from './tmer.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TmerService {

  constructor(private http:HttpClient) {}

  
    public getTmerById(tmerId:string): Observable<any> {
      return this.http.get('/api/v1/tmers/' + tmerId);
    }

      public getTmers(): Observable<any> {
        return this.http.get('/api/v1/tmers');
    }
    
        public getTmersByCity(city: string): Observable<any> {
        return this.http.get(`/api/v1/tmers?city=${city}`);
    }
    
    public createTmer(tmer: Tmer): Observable<any> {
      return this.http.post('/api/v1/tmers', tmer);
  }
    public getUserTmers(): Observable<any> {
      return this.http.get('/api/v1/tmers/manage');
  }
  
  public deleteTmer(tmerId: string): Observable<any> {
    return this.http.delete(`/api/v1/tmers/${tmerId}`);
  }
 }




