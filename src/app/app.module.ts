import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { TmersComponent } from './tmers/tmers.component';   //this is RentalComponent


import { TmerModule } from './tmers/tmer.module';
import { AuthModule } from './auth/auth.module';

import { ManageModule } from './manage/manage.module';




const routes: Routes = [
  {path:"", redirectTo:'/tmers', pathMatch: 'full'}

]



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
    ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    TmerModule,
    AuthModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ManageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
