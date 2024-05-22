import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { TmerService } from 'src/app/tmers/shared/tmer.service';
import { ToastrService } from 'ngx-toastr';
import { Tmer } from 'src/app/tmers/shared/tmer.model';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'jquery';

@Component({
  selector: 'app-manage-tmer',
  templateUrl: './manage-tmer.component.html',
  styleUrls: ['./manage-tmer.component.scss']
})
export class ManageTmerComponent implements OnInit {

  tmers: Tmer[];
  tmerDeleteIndex: number | null = null;


  constructor(private tmerService: TmerService,
              public toastr: ToastrService,
              private vcr: ViewContainerRef) {
    
               }

  ngOnInit(): void {
    
    this.tmerService.getUserTmers().subscribe(
      (tmers: Tmer[]) => {
        this.tmers = tmers;
      },
      () => {
        // Handle error if needed
      }
    );
  }

  // Method to show the confirmation dialog
  showConfirmation(index: number) {
    this.tmerDeleteIndex = index;
  }

  // Method to cancel the delete operation
  cancelDelete() {
    this.tmerDeleteIndex = null;
  }



deleteTmer(tmerId: string) {
  if (this.tmerDeleteIndex !== null && this.tmerDeleteIndex >= 0 && this.tmerDeleteIndex < this.tmers.length) {
    const deletedIndex = this.tmers.findIndex(tmer => tmer._id === tmerId);
    if (deletedIndex !== -1) {
      this.tmerService.deleteTmer(tmerId).subscribe(
        () => {
          this.tmers.splice(deletedIndex, 1);
          this.tmerDeleteIndex = null; // Reset to null after deletion
          this.toastr.success('Tmer deleted successfully!', 'Success');
        },
        (errorResponse: HttpErrorResponse) => {
          console.error('Error response:', errorResponse); // Log the entire error response
          // Check if errorResponse, errorResponse.error, errorResponse.error.errors are defined
          const errorDetail = errorResponse?.error?.errors?.[0]?.detail;
          if (errorDetail) {
            // Log the error response to the console
            console.error('Error detail:', errorDetail);
            // Display error message with Toastr
            this.toastr.error(errorDetail, 'Failed!');
          } else {
            console.error('Error response:', errorResponse);
            this.toastr.error('Cannot delete Tmer with active bookings!".', 'Failed!');
          }
        });
    }
  }
}

 


}
