import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
 import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule,HttpClientModule],
   providers: [AuthService,UtilityService], 
})
export class LoginComponent implements OnInit {

  // constructor(private router: Router) { }

  ngOnInit() { }
//   usePincode() {
//     this.router.navigate(['/auth/pincode']);  
//   }
//   opendinein(){
// this.router.navigate(['/pages/dineintable']);  
//   }
username = 'Admin';
  password = '1';

  constructor(
    private authService: AuthService,
    private router: Router,
    //private messageService: ToastService,
    private utilityServic: UtilityService,
  ) {}

  login() {
    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (res) => {
          if (true) {
            this.router.navigate(['/pages/dineintable']);
            this.utilityServic.SetLoginData(res.data);
          } else {
          
           //  this.messageService.showError('LogIn Failed!');
          }
        },
        error: (err) => {
        //   this.messageService.showError('SomeThing Wentrong!');

        },
      });
  }
}
