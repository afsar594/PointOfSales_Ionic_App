import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule]
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }
  usePincode() {
    this.router.navigate(['/auth/pincode']);  
  }
  opendinein(){
this.router.navigate(['/pages/dineintable']);  
  }
}
