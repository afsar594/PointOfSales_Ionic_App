import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.component.html',
  styleUrls: ['./pincode.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class PincodeComponent  implements OnInit {

  constructor(private router: Router) { }
 pin: string = '';

  append(num: string) {
    if (this.pin.length < 6) {
      this.pin += num;
    }
  }

  clear() {
    this.pin = '';
  }

  submit() {
    alert('Submitted PIN: ' + this.pin);
  }

  cardLogin() {
    alert('Card login');
  }

  shutdown() {
    alert('Shutdown triggered');
  }
    
  opendinein(){
this.router.navigate(['/pages/dineintable']);  
  }
ngOnInit(): void {
  
}

}
