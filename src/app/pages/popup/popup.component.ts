import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';
import { MergeTableComponent } from '../merge-table/merge-table.component';
import { ModalController } from '@ionic/angular';
import { AddTableComponent } from '../add-table/add-table.component';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
    standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class PopupComponent  implements OnInit {
@Input() table: any;

  constructor(private popoverCtrl: PopoverController,private modalController: ModalController,
) {}
  async mergeTable() {
    const modal = await this.modalController.create({
      component:  MergeTableComponent,
      cssClass: 'custom-width-modal',
      componentProps: {
       },
    });
 
    await modal.present();
  }
   async joinTable() {
    const modal = await this.modalController.create({
      component:  AddTableComponent,
      cssClass: 'custom-width-modal',
      componentProps: {
       },
    });
 
    await modal.present();
  }
  viewDetails() {
    console.log('View:', this.table);
    this.popoverCtrl.dismiss();
  }

  
 
  ngOnInit() {}

}
