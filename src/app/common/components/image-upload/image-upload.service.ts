import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define an interface for the coordinates object
interface Coordinates {
  lat: number;
  lng: number;
}

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  public uploadImage(image: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', image);

    return this.http
      .post<{ imageUrl: string }>('/api/v1/image-upload', formData)
      .pipe(
        map((response) => response.imageUrl) // Extract `imageUrl` from response
      );
  }
}
