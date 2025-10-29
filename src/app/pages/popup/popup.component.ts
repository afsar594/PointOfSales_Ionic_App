import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonicModule,
  ModalController,
  PopoverController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { MergeTableComponent } from '../merge-table/merge-table.component';
import { AddTableComponent } from '../add-table/add-table.component';
import { GeneralItemsService } from 'src/app/services/general-items.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class PopupComponent implements OnInit {
  @Input() table: any;
  @Input() order: any;
  @Input() orderselectedId: any;
  @Input() area: any;

  netTotal = 0;
  total = 0;
  exclusiveVatRate = 1.05;
  vatRate = 0.05;

  constructor(
    private popoverCtrl: PopoverController,
    private modalController: ModalController,
    private service: GeneralItemsService,
    private messageService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    // ✅ Ensure objects exist
    this.order = this.order ?? {};
    this.order.orderDetails = this.order.orderDetails ?? [];
    this.order.settlementDetails = this.order.settlementDetails ?? [];

    console.log('Popup Initialized →', {
      table: this.table,
      order: this.order,
      orderselectedId: this.orderselectedId,
      area: this.area,
    });
  }

  async mergeTable() {
    const modal = await this.modalController.create({
      component: MergeTableComponent,
      cssClass: 'custom-width-modal',
      componentProps: {
        config: {
          data: {
            id: this.orderselectedId,
            mergeOrderId: this.order?.mergeOrderId ?? null,
          },
        },
      },
    });

    modal.onDidDismiss().then((res: any) => {
      const result = res?.data;
      console.log('Merge Result:', result);

      if (!result?.ordersData) return;

      // ✅ Ensure order is initialized
      if (!this.order) this.order = { orderDetails: [], settlementDetails: [] };

      this.order.mergeOrderId = result?.mergeOrderIds ?? null;

      result.ordersData.forEach((i: any) => {
        this.order.orderDetails.push(...i.orderDetails);
      });

      this.getTotal();
      if (this.orderselectedId) {
        this.updateOrder(this.orderselectedId, this.order);
      }
    });

    await modal.present();
  }

  async joinTable() {
    const modal = await this.modalController.create({
      component: AddTableComponent,
      cssClass: 'custom-width-modal',
    });
    await modal.present();
  }

  viewDetails() {
    console.log('View Table: ', this.table);
    this.popoverCtrl.dismiss();
  }

  updateOrder(id: any, order: any) {
    this.service.updateOrder(id, order).subscribe({
      next: (response: any) => {
        if (response?.isSuccess) {
          this.messageService.show('Order Updated Successfully ✅', 'success');

          order?.orderType === 'Dine-In'
            ? this.navigateToTable()
            : this.router.navigate(['/main']);
        } else {
          this.messageService.show('Order update failed ❌', 'danger');
        }
      },
      error: () => {
        this.messageService.show('Failed to update order ❌', 'danger');
      },
    });
  }

  getTotal() {
    let grossTotal = 0;

    this.order.orderDetails.forEach((item: any) => {
      grossTotal += item.total || 0;
    });

    const discountRow = this.order.settlementDetails.find(
      (t: any) => t.trans_Description?.trim().toUpperCase() === 'DISCOUNT'
    );
    const discount = Number(discountRow?.amount) || 0;
    const netAfterDiscount = grossTotal - discount;

    const billAmount = +(netAfterDiscount / this.exclusiveVatRate).toFixed(2);
    const vatAmount = +(netAfterDiscount - billAmount).toFixed(2);
    const grandTotal = +(billAmount + vatAmount).toFixed(2);

    this.netTotal = billAmount;
    this.total = grandTotal;

    this.order.netAmount = grandTotal;
    this.order.vatAmt = vatAmount;
    this.order.totalAmount = grossTotal;

    this.order.settlementDetails = this.order.settlementDetails.map(
      (t: any) => {
        const desc = t.trans_Description?.trim().toUpperCase();
        if (desc === 'NET AMOUNT') return { ...t, amount: grandTotal };
        if (desc.includes('VAT')) return { ...t, amount: vatAmount };
        if (desc === 'BILL AMOUNT') return { ...t, amount: billAmount };
        if (desc === 'TOTAL AMOUNT') return { ...t, amount: grossTotal };
        return t;
      }
    );
  }

  navigateToTable() {
    this.router.navigate(['/table'], {
      state: {
        orderType: this.order?.orderType,
        orderTypeId: this.order?.orderTypeId,
        area: this.area,
      },
    });
  }
}
