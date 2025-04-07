import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // ✅ Add this
import { UserService } from '../share/user.service';
import { AuthService } from 'src/app/auth/shared/auth.service';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule, // ✅ Add this here
  ],
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit {
  user: any;
  selectedTab = 'home';

  
  constructor(private userService: UserService, private auth: AuthService) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    const userId = this.auth.getUserId();
    this.userService.getUser(userId).subscribe(
      (user) => {
        console.log(user);
        this.user = user;
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }
}
