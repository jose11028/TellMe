//this is RentalModule.component.ts
import { NgModule } from '@angular/core';
import { TmerListComponent } from './tmer-list/tmer-list.component';
import { TmerListItemComponent } from './tmer-list-item/tmer-list-item.component';
import { TmersComponent } from './tmers.component';
import { NgPipesModule } from 'ngx-pipes';

import { MapModule } from '../common/map/map.module';
import { Daterangepicker } from 'ng2-daterangepicker';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import {Routes, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { TmerService } from './shared/tmer.service';
import { BookingService } from '../booking/shared/booking.service';
import { HelperService } from '../common/service/helper.service';
import { UppercasePipe } from '../common/pipes/uppercase.pipe';

import { TmerDetailComponent } from './tmer-detail/tmer-detail.component';
import { TmerDetailBookingComponent } from './tmer-detail/tmer-detail-booking/tmer-detail-booking.component';
import { TmerSearchComponent } from './tmer-search/tmer-search.component';
import { TmerCreateComponent } from './tmer-create/tmer-create.component';


import { AuthGuard } from '../auth/shared/auth.guard';





const routes: Routes = [
  {path:"tmers",
   component:TmersComponent,
    children: [
      { path: '', component: TmerListComponent },
      {path:'new',component:TmerCreateComponent, canActivate: [AuthGuard]},
      { path: ':tmerId', component: TmerDetailComponent,  }, //this option (AuthGuard) block the option /login
      {path:':city/homes', component:TmerSearchComponent} 
    ]}

]




@NgModule ({
  declarations: [
    TmerListComponent,
    TmerListItemComponent,
    TmersComponent,
    TmerDetailComponent,
    UppercasePipe,
    TmerDetailBookingComponent,
    TmerSearchComponent,
    TmerCreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    MapModule,
    NgPipesModule,
    Daterangepicker,
    FormsModule
    
    
   
  ],
  providers: [TmerService,
              HelperService,
              BookingService
  ]
})
export class TmerModule {

}
