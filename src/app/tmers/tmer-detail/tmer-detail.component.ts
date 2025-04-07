import { TmerService } from './../shared/tmer.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tmer } from '../shared/tmer.model';  //this is the class Tmer

@Component({
  selector: 'app-tmer-detail',
  templateUrl: './tmer-detail.component.html',
  styleUrls: ['./tmer-detail.component.scss']
})
export class TmerDetailComponent implements OnInit {


  tmer:Tmer;


  constructor(private route:ActivatedRoute, private tmerService:  TmerService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        this.getTmer(params['tmerId']);
      })
  }

  getTmer(tmerId: string ){
    this.tmerService.getTmerById(tmerId).subscribe(
      (tmer:Tmer) => {
        this.tmer = tmer;
      });
  }


}
