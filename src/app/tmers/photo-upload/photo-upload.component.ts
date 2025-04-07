import {
  Component,
  EventEmitter,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoUploadService } from './photo-upload.service';
import { ImageCropperModule, ImageCroppedEvent } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';

// FileSnippet class to represent each file's state
class FileSnippet {
  static readonly IMAGE_SIZE = { width: 850, height: 650 };
  pending: boolean = false;
  status: string = 'INIT';
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [CommonModule, ImageCropperModule],
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss'],
})
export class PhotoUploadComponent {
  @Output() imageUploaded = new EventEmitter<string>();
  @Output() imageError = new EventEmitter<string>();
  @Output() imageLoadedToContainer = new EventEmitter();
  @Output() croppingCanceled = new EventEmitter();

  selectedFiles: FileSnippet[] = [];
  imageChangedEvent: any;
  errors: never[] = [];

  constructor(
    private toastr: ToastrService,
    private vcr: ViewContainerRef,
    private photoUploadService: PhotoUploadService
  ) {}

  private onSuccess(imageUrl: string) {
    for (let fileSnippet of this.selectedFiles) {
      if (fileSnippet.file && fileSnippet.src === imageUrl) {
        fileSnippet.pending = false;
        fileSnippet.status = 'OK';
        fileSnippet.src = imageUrl; // Update the src with the uploaded image URL
      }
    }
    this.imageUploaded.emit(imageUrl);
  }

  private onFailure() {
    for (let fileSnippet of this.selectedFiles) {
      if (fileSnippet.pending) {
        fileSnippet.pending = false;
        fileSnippet.status = 'FAIL';
      }
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

  imageCropped(event: ImageCroppedEvent, fileSnippet: FileSnippet) {
    if (event.base64) {
      const file = this.base64ToFile(event.base64, 'cropped-image.jpg');
      fileSnippet.src = event.base64;
      fileSnippet.file = file;
    } else {
      console.error('No base64 emitted by the cropper event');
    }
  }

  processMultipleFiles(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          if (
            img.width >= FileSnippet.IMAGE_SIZE.width &&
            img.height >= FileSnippet.IMAGE_SIZE.height
          ) {
            this.selectedFiles.push(new FileSnippet('', file)); // Add file to selectedFiles array
          } else {
            this.toastr.error(
              `Image dimensions are too small. Minimum size is ${FileSnippet.IMAGE_SIZE.width}x${FileSnippet.IMAGE_SIZE.height}.`,
              'Error'
            );
          }
          URL.revokeObjectURL(url);
        };

        img.onerror = () => {
          this.toastr.error(
            'Invalid file type. Only jpeg and png are allowed!',
            'Error'
          );
          URL.revokeObjectURL(url);
        };

        img.src = url;
      } else {
        this.toastr.error(
          'Unsupported File Type. Only jpeg and png are allowed!',
          'Error'
        );
      }
    }
  }

  uploadImages() {
    for (const fileSnippet of this.selectedFiles) {
      if (fileSnippet.file) {
        const reader = new FileReader();
        reader.onload = () => {
          fileSnippet.pending = true;
          this.photoUploadService.uploadImage(fileSnippet.file).subscribe(
            (imageUrl: string) => {
              this.onSuccess(imageUrl);
            },
            () => {
              this.onFailure();
            }
          );
        };
        reader.readAsDataURL(fileSnippet.file);
      }
    }
  }

  cancelCropping() {
    this.imageChangedEvent = null;
    this.croppingCanceled.emit();
  }

  imageLoaded() {
    this.imageLoadedToContainer.emit();
  }

  cropperReady() {
    console.log('Cropper is ready');
  }
}
