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
export class AddRemarksComponent implements OnInit {
  selectedRemarks: Set<number> = new Set();
  itemNotes: { key: number; value: string }[] = [];

  remarks = [
    { id: 1, label: 'Take-Away (RM 0.30)', color: 'danger' },
    { id: 2, label: 'Extra Egg (RM 1.00)', color: 'danger' },
    { id: 3, label: 'Extra Rice (RM 0.50)', color: 'danger' },
    { id: 4, label: 'Extra Spicy', color: 'medium' },
    { id: 5, label: 'Less Spicy', color: 'medium' },
    { id: 6, label: 'No Egg (RM -0.50)', color: 'tertiary' },
    { id: 7, label: 'No Meat', color: 'medium' },
    { id: 8, label: 'No Seafood', color: 'medium' },
    { id: 9, label: 'No Vege (RM -0.20)', color: 'tertiary' },
  ];

  constructor(private modalCtrl: ModalController) {}

  toggleRemark(remark: any) {
    if (this.selectedRemarks.has(remark.id)) {
      this.selectedRemarks.delete(remark.id);
    } else {
      this.selectedRemarks.add(remark.id);
    }

    this.itemNotes = this.remarks
      .filter((r) => this.selectedRemarks.has(r.id))
      .map((r) => ({ key: r.id, value: r.label }));
  }

  getButtonColor(remark: any): string {
    return this.selectedRemarks.has(remark.id) ? remark.color : 'light';
  }

  closeForm() {
    this.modalCtrl.dismiss(this.itemNotes);
  }
  ngOnInit() {}
}
