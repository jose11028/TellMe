import { NgModule } from '@angular/core';

import {Routes, RouterModule} from '@angular/router';

import { FormsModule } from '@angular/forms';
//import { AuthService } from './shared/auth.service';




import { AuthComponent } from '../auth/auth.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';

import { AuthService } from './shared/auth.service';

import { AuthGuard } from './shared/auth.guard';
import { TokenInterceptor } from './shared/token.interceptor';






const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] }, 
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] }
]



@NgModule({
  declarations: [
    
    AuthComponent,
    LoginComponent,
    RegisterComponent

  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    ReactiveFormsModule
   
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
 
})
export class AuthModule { }



