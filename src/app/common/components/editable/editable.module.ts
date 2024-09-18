import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditableInputComponent } from './editable-input/editable-input.component';
import { EditableTextareaComponent } from './editable-textarea/editable-textarea.component';
import { EditableSelectComponent } from './editable-select/editable-select.component'; // Add your component here

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    EditableInputComponent,
    EditableTextareaComponent,
    EditableSelectComponent // Declare your component here
  ],
  exports: [
    EditableInputComponent,
    EditableTextareaComponent,
    EditableSelectComponent // Export your component here
  ]
})
export class EditableModule {}
