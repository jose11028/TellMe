import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Tmer } from '../shared/tmer.model';
import { TmerService } from '../shared/tmer.service';


import { Router } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'jquery';

@Component({
  selector: 'app-tmer-create',
  templateUrl: './tmer-create.component.html',
  styleUrls: ['./tmer-create.component.css'],
})
export class TmerCreateComponent implements OnInit {
  newTmer: Tmer;
  tmerCategories = Tmer.CATEGORIES;
  errors: string[] = [];

  constructor(private tmerService: TmerService, private router: Router) {}

  handleImageChange() {
    this.newTmer.image = '/assets/images/model.jpeg';
  }

  ngOnInit() {
    this.newTmer = new Tmer();
    this.newTmer.shared = false;
  }

  handleImageUpload(imageUrl: string) {
    this.newTmer.image = imageUrl;
  }
  handleImageError() {
    this.newTmer.image = '';
  }

  /* createTmer() {
    this.tmerService.createTmer(this.newTmer).subscribe(
      (tmer:Tmer) => {
        this.router.navigate([`/tmers/${tmer._id}`]);
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.error) { // Check if error object and error message exist
          this.errors = [errorResponse.error.error];
        } else {
          this.errors = ['An unknown error occurred.']; // Fallback error message
        }
      })
  } */

  createTmer() {
    this.tmerService.createTmer(this.newTmer).subscribe(
      (tmer: Tmer) => {
        this.router.navigate([`/tmers/${tmer._id}`]);
      },
      (errorResponse: HttpErrorResponse) => {
        if (errorResponse.error && errorResponse.error.error) {
          // Check if error object and error message exist
          this.errors = [errorResponse.error.error];
        } else {
          this.errors = ['An unknown error occurred.']; // Fallback error message
        }
      }
    );
  }
}
