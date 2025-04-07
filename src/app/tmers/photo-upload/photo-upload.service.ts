import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PhotoUploadService {
  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file); // Append the image to FormData
    return this.http.post<{ imageUrl: string }>(
      '/api/v1/photo-upload',
      formData
    ); // Adjust the URL to match your backend endpoint
  }
}
