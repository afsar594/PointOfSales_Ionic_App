import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddRemarksComponent } from '../add-remarks/add-remarks.component';
import { OrderListComponent } from '../order-list/order-list.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddItemComponent implements OnInit {
  @Input() tableData: any;
    @Input() itemStore: any;

  quantity: number = 1;
  // itemStore: any;
  pax = 1;
  orderList: any;
  increaseQty() {
    this.quantity++;
    this.updateQuantityAndTotal();
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
      this.updateQuantityAndTotal();
    }
  }

  private updateQuantityAndTotal() {
    this.tableData.qty = this.quantity;
    this.tableData.total = Number(
      (this.tableData?.unitPrice1 * this.tableData?.qty).toFixed(2)
    );
  }

  constructor(
    private modalController: ModalController,
    private messageService: ToastService
  ) {}
  async openModal() {
    const modal = await this.modalController.create({
      component: AddRemarksComponent,
    });
    modal.present();
  }
  closeForm() {
    this.modalController.dismiss();
  }
  async orderlistForm() {
    if (!this.itemStore) {
      this.itemStore = [];
    }

    if (this.tableData && this.tableData.itemId) {
      const exists = this.itemStore.some(
        (item: { itemId: any }) => item.itemId === this.tableData.itemId
      );

      if (!exists) {
        this.itemStore.push({ ...this.tableData });
      } else {
        this.messageService.show('Item already exists!');
        await this.modalController.dismiss();
        return;
      }
    } else {
      this.messageService.show('Something went wrong!');
      await this.modalController.dismiss();
      return;
    }

    const modal = await this.modalController.create({
      component: OrderListComponent,
      cssClass: 'custom-width-modal',
      componentProps: {
        itemStore: this.itemStore,
      },
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data) {
      this.itemStore = data;
      console.log('Updated itemStore:', this.itemStore);
    }
  }

  ngOnInit()
   {
    this.tableData.qty = 1;
    this.tableData.total = this.tableData?.unitPrice1;
      console.log('comming', this.itemStore);
    this.orderList = this.itemStore;
  }
  nextSelect() {
    if (!this.itemStore) {
      this.itemStore = [];
    }

    if (this.tableData && this.tableData.itemId) {
      const exists = this.itemStore.some(
        (item: { itemId: any }) => item.itemId === this.tableData.itemId
      );

      if (!exists) {
        this.itemStore.push({ ...this.tableData });
      } else {
        this.messageService.show('Item already exists!');
      }
    } else {
      this.messageService.show('Something went wrorng!');
    }
    this.modalController.dismiss(this.itemStore);
  }
  anyItemSelected = false;

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
}
