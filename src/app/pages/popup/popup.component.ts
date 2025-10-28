import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
    standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class PopupComponent  implements OnInit {
@Input() table: any;

  constructor(private popoverCtrl: PopoverController) {}

  viewDetails() {
    console.log('View:', this.table);
    this.popoverCtrl.dismiss();
  }

  editTable() {
    console.log('Edit:', this.table);
    this.popoverCtrl.dismiss();
  }

  deleteTable() {
    console.log('Delete:', this.table);
    this.popoverCtrl.dismiss();
  }
 
  ngOnInit() {}

}
