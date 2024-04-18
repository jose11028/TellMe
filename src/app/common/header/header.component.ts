import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/shared/auth.service';
import { Router } from '@angular/router'

@Component({
  selector:"tm2-header",
  templateUrl:"./header.component.html",
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent{

  constructor(public auth: AuthService,
              private router: Router) { }

  logout() {

    
    this.auth.logout();
    
    this.router.navigate(['/login']);
  }
  
  search(city: string) {
    city ? this.router.navigate([`/tmers/${city}/homes`]) : this.router.navigate(['/tmers']);
  }

}
