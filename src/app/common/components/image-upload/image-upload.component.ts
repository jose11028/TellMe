import { Component, EventEmitter, Output, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from './image-upload.service';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
//import { ToastsManager } from 'ng2-toastr/ng2-toastr';

class FileSnippet {
  static readonly IMAGE_SIZE = { width: 850, height: 650 };
  pending: boolean = false;
  status: string = 'INIT';
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageError = new EventEmitter<string>();
  @Output() imageLoadedToContainer = new EventEmitter();
  @Output() croppingCanceled = new EventEmitter();

  selectedFile?: FileSnippet;
  imageChangedEvent: any;
  errors: never[];

  constructor(
    private toastr: ToastrService,
    private vcr: ViewContainerRef,
    private imageService: ImageUploadService
  ) {
    this.errors = [];
  }

  private onSucces(imageUrl: string) {
    if (this.selectedFile) {
      this.selectedFile.pending = false;
      this.selectedFile.status = 'OK';
      this.imageChangedEvent = null;
    }
    this.imageUploaded.emit(imageUrl);
  }

  private onFailure() {
    if (this.selectedFile) {
      this.selectedFile.pending = false;
      this.selectedFile.status = 'FAIL';
      this.imageChangedEvent = null;
    }
    this.imageError.emit('');
  }

  private base64ToFile(base64: string, filename: string): File {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return new File([blob], filename, { type: 'image/jpeg' });
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      const file = this.base64ToFile(event.base64, 'cropped-image.jpg');
      return (this.selectedFile = new FileSnippet(event.base64, file));
    } else {
      console.error('No base64 emitted by the cropper event');
    }
  }

  imageLoaded() {
    this.imageLoadedToContainer.emit();
  }

  cancelCropping() {
    this.imageChangedEvent = null;
    this.croppingCanceled.emit();
  }

  cropperReady() {
    console.log('Cropper is ready');
  }

  processFile(event: any) {
    this.selectedFile = undefined;

    const file = event.target.files[0];
    if (!file || (file.type !== 'image/png' && file.type !== 'image/jpeg')) {
      console.error('Invalid file type. Please select a PNG or JPEG image.');
      this.toastr.error(
        'Unsupported File Type.Only jpeg and png is allowed!',
        'Error'
      );

      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      if (
        img.width >= FileSnippet.IMAGE_SIZE.width &&
        img.height >= FileSnippet.IMAGE_SIZE.height
      ) {
        this.imageChangedEvent = event;
      } else {
        this.toastr.error(
          `Image dimensions are too small. Minimum size is ${FileSnippet.IMAGE_SIZE.width}x${FileSnippet.IMAGE_SIZE.height}.`,
          'Error'
        );
        console.error(
          `Image dimensions are too small. Minimum size is ${FileSnippet.IMAGE_SIZE.width}x${FileSnippet.IMAGE_SIZE.height}.`
        );
      }
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      this.toastr.error(
        'Unsupported File Type.Only jpeg and png is allowed!',
        'Error'
      );
      console.error('Failed to load image. Please select a valid image file.');
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }

  uploadImage() {
    if (!this.selectedFile) {
      console.error('No file selected or cropped.');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (this.selectedFile && reader.result) {
        this.selectedFile.pending = true;
        this.selectedFile.src = reader.result as string; // Cast result as string

        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.onSucces(imageUrl);
          },
          () => {
            this.toastr.error(
              'Unsupported File Type.Only jpeg and png is allowed!',
              'Error'
            );
            this.onFailure();
          }
        );
      }
    });

    reader.readAsDataURL(this.selectedFile.file);
  }

  /* 

  uploadImage() {
    if (!this.selectedFile) {
      console.error('No file selected or cropped.');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (this.selectedFile) {
        this.selectedFile.pending = true;
        this.selectedFile.src = event.target.result;

        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.onSucces(imageUrl);
          },
          () => {
            this.onFailure();
          }
        );
      }
    });

    reader.readAsDataURL(this.selectedFile.file);
  }
 */
}

/* import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from './image-upload.service';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';

class FileSnippet {
  static readonly IMAGE_SIZE = { width: 750, height: 422 };
  pending: boolean = false;
  status: string = 'INIT';
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {

 
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageError = new EventEmitter<string>();

  selectedFile?: FileSnippet;
  imageChangedEvent: any;

  constructor(private imageService: ImageUploadService) {}

  private onSucces(imageUrl: string) {
    if (this.selectedFile) {
      this.selectedFile.pending = false;
      this.selectedFile.status = 'OK';
    }
    this.imageUploaded.emit(imageUrl);
  }

  private onFailure() {
    if (this.selectedFile) {
      this.selectedFile.pending = false;
      this.selectedFile.status = 'FAIL';
    }
    this.imageError.emit('');
  }

  private base64ToFile(base64: string, filename: string): File {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return new File([blob], filename, { type: 'image/jpeg' });
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      const file = this.base64ToFile(event.base64, 'cropped-image.jpg');
      this.selectedFile = new FileSnippet(event.base64, file);
    } else {
      console.error('No base64 emitted by the cropper event');
    }
  }

  cropperReady() {
    console.log('Cropper is ready');
  }

  processFile(event: any) {
    this.selectedFile = undefined;
    //this.imageChangedEvent = event;

    const URL = window.URL;
    let file, img;
    if ((file = event.target.files[0]) && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      img = new Image();

      img.onload = function () {
        if (this.width > FileSnippet.IMAGE_SIZE.width && this.height > FileSnippet.IMAGE_SIZE.height) {

        }
          
        }
      
      
    } else {
      
    }
  }

  uploadImage() {
    if (!this.selectedFile) {
      console.error('No file selected or cropped.');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (this.selectedFile) {
        this.selectedFile.pending = true;

        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.onSucces(imageUrl);
          },
          () => {
            this.onFailure();
          }
        );
      }
    });

    reader.readAsDataURL(this.selectedFile.file);
  }
}
 */

/* import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadService } from './image-upload.service';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';

class FileSnippet {
  pending: boolean = false;
  status: string = 'INIT';
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageError = new EventEmitter<string>();

  selectedFile?: FileSnippet;
  imageChangedEvent: any;

  constructor(private imageService: ImageUploadService) {}

  private onSucces(imageUrl: string) {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'OK';
    this.imageUploaded.emit(imageUrl);
  }

  private onFailure() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'FAIL';
    this.imageError.emit('');
  }

  // Convert base64 to File
  private base64ToFile(base64: string, filename: string): File {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' });
    return new File([blob], filename, { type: 'image/jpeg' });
  }

  // Handle the cropped image event
  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      const file = this.base64ToFile(event.base64, 'cropped-image.jpg');
      this.selectedFile = new FileSnippet(event.base64, file);
    } else {
      console.error('No base64 emitted by the cropper event');
    }
  }

  cropperReady() {
    console.log('Cropper is ready');
  }

  // Handle file input changes
  processFile(event: any) {
    this.selectedFile = undefined;
    this.imageChangedEvent = event;
  }

  uploadImage() {
    if (!this.selectedFile) {
      console.error('No file selected or cropped.');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
      this.selectedFile.pending = true;

      this.imageService.uploadImage(this.selectedFile.file).subscribe(
        (imageUrl: string) => {
          this.onSucces(imageUrl);
        },
        () => {
          this.onFailure();
        }
      );
    });

    reader.readAsDataURL(this.selectedFile.file);
  }
 */
// Upload the selected image
/*  uploadImage() {
    if (this.selectedFile) {
      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {
        this.selectedFile.pending = true;
        this.imageService.uploadImage(this.selectedFile.file).subscribe(
          (imageUrl: string) => {
            this.onSucces(imageUrl);
          },
          () => {
            this.onFailure();
          }
        );
      });
      reader.readAsDataURL(this.selectedFile.file);
    }
  }
 } */

/* import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


class FileSnippet {
  constructor(public src: string, public file: File) {}

}

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [],
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnInit {

  selectedFile: FileSnippet;


  constructor() { }
  
  
  ngOnInit(): void {
   
  }


  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
  


    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new FileSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);


  }
}
 */
