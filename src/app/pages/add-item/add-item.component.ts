import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular'; 
import { AddRemarksComponent } from '../add-remarks/add-remarks.component';
import { OrderListComponent } from '../order-list/order-list.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
     standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class AddItemComponent  implements OnInit {

  constructor(private modalController: ModalController,  

   ) {}
 async openModal() {
    const modal = await this.modalController.create({
      component:  AddRemarksComponent,
        cssClass: 'custom-width-modal'
    });
    modal.present();
 
  }
  closeForm() {
    this.modalController.dismiss();
  }
   async orderlistForm() {
      const modal = await this.modalController.create({
        component: OrderListComponent,
        cssClass: 'custom-width-modal',
        
      });
      modal.present();
    }
  ngOnInit() {}

}
