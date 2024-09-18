import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditableComponent } from '../editable-component';
import { retry } from 'rxjs';

@Component({
  selector: 'app-editable-input',
  templateUrl: './editable-input.component.html',
  styleUrls: ['./editable-input.component.scss']
})
export class EditableInputComponent extends EditableComponent implements OnInit {
  @Input() type: string = 'text';
  @Input() transformView = (value: any) => value;
}

 
 
  /* @Input() entity: any;
  
  @Input() set field(entityField: string) {
    this.entityField = entityField;
    this.setOriginVAlue();
  }; 
  @Input() className: string;

  @Input() type: string = 'text';
  @Input() style: any;

  @Output() entityUpdate = new EventEmitter<any>(); 
  

  isActiveInput: boolean = false;

  public entityField: string;

  public originEntityValue: any;

  constructor() {}

  ngOnInit(): void {}

  updateEntity() {
    const entityValue = this.entity[this.entityField];
    if (entityValue !== this.originEntityValue) {
      this.entityUpdate.emit({ [this.entityField]: this.entity[this.entityField] }); 
      this.setOriginVAlue();
    }
    this.isActiveInput = false;
  }

  cancelUpdate() {
    this.isActiveInput = false;
    this.entity[this.entityField] = this.originEntityValue;
  }

  setOriginVAlue() {
    this.originEntityValue = this.entity[this.entityField];
  } */