import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular'; 
import { AddRemarksComponent } from '../add-remarks/add-remarks.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
     standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class AddItemComponent  implements OnInit {

  constructor(private modalCtrl: ModalController,
   ) {}
 async openModal() {
    const modal = await this.modalCtrl.create({
      component:  AddRemarksComponent,
        cssClass: 'custom-width-modal'
    });
    modal.present();
 
  }
  closeForm() {
    this.modalCtrl.dismiss();
  }
  ngOnInit() {}

}
