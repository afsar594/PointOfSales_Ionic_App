import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-add-remarks',
  templateUrl: './add-remarks.component.html',
  styleUrls: ['./add-remarks.component.scss'],
        standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class AddRemarksComponent  implements OnInit {
selectedRemarks: Set<string> = new Set();

  remarks = [
    { id: 'takeaway', label: 'Take-Away (RM 0.30)', color: 'danger' },
    { id: 'extraEgg', label: 'Extra Egg (RM 1.00)', color: 'danger' },
    { id: 'extraRice', label: 'Extra Rice (RM 0.50)', color: 'danger' },
    { id: 'extraSpicy', label: 'Extra Spicy', color: 'medium' },
    { id: 'lessSpicy', label: 'Less Spicy', color: 'medium' },
    { id: 'noEgg', label: 'No Egg (RM -0.50)', color: 'tertiary' },
    { id: 'noMeat', label: 'No Meat', color: 'medium' },
    { id: 'noSeafood', label: 'No Seafood', color: 'medium' },
    { id: 'noVege', label: 'No Vege (RM -0.20)', color: 'tertiary' },
  ];

  constructor(private modalCtrl: ModalController) {}

  toggleRemark(remark: any) {
    if (this.selectedRemarks.has(remark.id)) {
      this.selectedRemarks.delete(remark.id);
    } else {
      this.selectedRemarks.add(remark.id);
    }
  }

  getButtonColor(remark: any): string {
    return this.selectedRemarks.has(remark.id) ? remark.color : 'light';
  }


  closeForm() {
    this.modalCtrl.dismiss();
  }
  ngOnInit() {}

}
