import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { OrderListComponent } from '../order-list/order-list.component';
import { AddRemarksComponent } from '../add-remarks/add-remarks.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddItemComponent implements OnInit {
  @Input() itemStore: any;
  orderList: any;
  anyItemSelected: boolean = false;
  totalAmount: number = 0;
  pax: any;
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log('aaa', this.itemStore);
    this.orderList = this.itemStore?.selectedItems?.map(
      (item: { qty: any; unitPrice1: any }) => ({
        ...item,
        selected: false,
        qty: item.qty || 1,
        total: item.unitPrice1 || 0,
      })
    );
  }

  increaseQty(item: any) {
    item.qty++;
    this.updateItemTotal(item);
  }

  decreaseQty(item: any) {
    if (item.qty > 1) {
      item.qty--;
      this.updateItemTotal(item);
    }
  }

  updateItemTotal(item: any) {
    item.total = Number((item.unitPrice1 * item.qty).toFixed(2));
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
  }

  closeForm() {
    this.modalController.dismiss();
  }

  async order() {
    this.orderList.tableId = this.itemStore.tableId;
    const modal = await this.modalController.create({
      component: OrderListComponent,
      cssClass: 'custom-width-modal',
      componentProps: {
        tableData: this.orderList,
      },
    });
    modal.present();
  }
  isMenuOpen = false;

  // openMenu(ev: any) {
  //   this.isMenuOpen = true;
  // }
  async openMenu(selectedItem: any) {
    const modal = await this.modalController.create({
      component: AddRemarksComponent,
      cssClass: 'custom-width-modal',
      breakpoints: [0, 0.5, 0.9],
      initialBreakpoint: 0.5,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      const index = this.orderList.findIndex(
        (item: { id: any }) => item.id === selectedItem.id
      );
      if (index !== -1) {
        this.orderList[index] = {
          ...this.orderList[index],
          itemNotes: data,
        };
      }
    }
  }
}
