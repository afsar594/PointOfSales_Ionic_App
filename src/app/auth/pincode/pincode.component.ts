import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss'],
  standalone: true,
  imports: [FormsModule, IonicModule],
})
export class PincodeComponent implements OnInit {
  title = 'login';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private utilityService: UtilityService
  ) { }



  login() {
    if (this.password.trim() === '') {
      this.toastService.show('Password is required', 'danger');
      return;
    }

    this.authService.login({ password: this.password }).subscribe({
      next: async (res) => {
        if (res.isSuccess) {
          this.utilityService.SetLoginData(res.data);

          localStorage.setItem('UserPermissionList', JSON.stringify(res.data?.userPermissions));
          this.toastService.show('Login successful!', 'success');
          this.router.navigate(['/pages/dineintable']);

        } else {
          this.toastService.show(res.message || 'Login failed', 'danger');
        }
      },
      error: () => {
        this.toastService.show('Something went wrong. Try again.', 'danger');
      },
    });
  }

  writetoinput(value: string) {
    if (value === 'clear') {
      this.password = this.password.slice(0, -1);
    } else {
      this.password += value;
    }
  }

  opendinein() {
    this.router.navigate(['/pages/dineintable']);
  }

  ngOnInit(): void { }
}
