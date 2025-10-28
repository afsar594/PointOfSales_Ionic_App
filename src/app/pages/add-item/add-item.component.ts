import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { OrderListComponent } from '../order-list/order-list.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddItemComponent implements OnInit {
  @Input() itemStore: any; // { selectedItems: [], existingItems: [], tableId }
  orderList: any[] = [];
  anyItemSelected: boolean = false;
  totalAmount: number = 0;
  pax: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log('selected', this.itemStore);
    const items = this.itemStore?.existingItems || [];
    this.orderList = items.map((item: any) => ({
      ...item,
      selected: false,
      qty: item.qty || 1,
      total: Number(((item.unitPrice1 || 0) * (item.qty || 1)).toFixed(2)),
      itemNotes: item.itemNotes || [],
    }));
    this.recalcTotal();
  }

  increaseQty(item: any) {
    item.qty++;
    this.updateItemTotal(item);
    this.recalcTotal();
  }

  decreaseQty(item: any) {
    if (item.qty > 1) {
      item.qty--;
      this.updateItemTotal(item);
      this.recalcTotal();
    }
  }

  updateItemTotal(item: any) {
    item.total = Number(((item.unitPrice1 || 0) * (item.qty || 1)).toFixed(2));
  }

  onSelectionChange() {
    this.anyItemSelected = this.orderList.some(
      (item: { selected: any }) => item.selected
    );
  }

  deleteSelected() {
    this.orderList = this.orderList.filter(
      (item: { selected: any }) => !item.selected
    );
    this.anyItemSelected = false;
    this.recalcTotal();
  }

  recalcTotal() {
    this.totalAmount = this.orderList.reduce(
      (s: number, it: any) => s + (Number(it.total) || 0),
      0
    );
  }

  closeForm() {
    this.modalController.dismiss();
  }

  // When finalizing order-list we may present OrderListComponent; on final save bubble 'reload'
  async order() {
    // attach tableId for OrderListComponent to use
    const modal = await this.modalController.create({
      component: OrderListComponent,
      cssClass: 'custom-width-modal',
      componentProps: {
        tableData: {
          selectedItems: this.orderList,
          tableId: this.itemStore?.tableId,
        },
      },
    });

    modal.onDidDismiss().then((res) => {
      if (res?.data === 'reload') {
        // final save done in nested OrderList => bubble up reload so DineInTable can refresh
        this.modalController.dismiss('reload');
      } else {
        // If user returns from OrderList without final save, we return updated selections to GroupItem
        this.modalController.dismiss({
          selectedItems: this.orderList.map((i) => ({ ...i })),
          existingItems: this.orderList.map((i) => ({ ...i })),
        });
      }
    });

    await modal.present();
  }

  async openRemarks(item: any) {
    const remarks = prompt('Enter remarks', (item.itemNotes || []).join(', '));
    if (remarks !== null) {
      item.itemNotes = remarks.split(',').map((s) => s.trim());
    }
  }
}
