//this is rental-list. this is parent

import { Component, OnInit } from '@angular/core';
import { TmerService } from '../shared/tmer.service';
import { Tmer } from '../shared/tmer.model';  //this is the class Tmer => Rental

@Component({
  selector: 'app-tmer-list',
  templateUrl: './tmer-list.component.html',
  styleUrls: ['./tmer-list.component.scss']
})
export class TmerListComponent implements OnInit {

  //this is the array rentals
  tmers: Tmer[] = [];
  /* filteredTmers: Tmer[] = [];
  private _customTitleFilter: string = '';
 */
  constructor(private tmerService: TmerService) {}

  ngOnInit(){

    const tmerObservable = this.tmerService.getTmers();


    tmerObservable.subscribe(
      (tmers: Tmer[]) => {
        this.tmers = tmers;
        /* this.filteredTmers = tmers;
        this.applyTitleFilter(); */
      },
      (err: any) => {
      },
      () => {
      });

  }

 /*  get customTitleFilterGetter(): string {
    return this._customTitleFilter;
  }

  set customTitleFilterSetter(filter: string) {
    this._customTitleFilter = filter;
    this.applyTitleFilter();
  }

 applyTitleFilter() {
  this.filteredTmers = this.customTitleFilterGetter && this.customTitleFilterGetter.trim()
    ? this.tmers.filter(tmer => (tmer.title ?? '').toLowerCase().includes(this.customTitleFilterGetter.toLowerCase()))
    : this.tmers;
} */


}
