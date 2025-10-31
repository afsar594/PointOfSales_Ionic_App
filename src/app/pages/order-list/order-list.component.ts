import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { GeneralItemsService } from 'src/app/services/general-items.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class OrderListComponent implements OnInit {
  @Input() tableData: any;

  pax = 1;
  orderList: any[] = [];
  GrossAmount = 0;
  VatAmount = 0;
  Discount = 0;
  NetAmount = 0;
  TotalAmount = 0;
  Isloading = false;
  order: any = {};

  constructor(
    private modalCtrl: ModalController,
    private orderService: GeneralItemsService,
    private messageService: ToastService
  ) {}

  ngOnInit() {
    this.orderList = Array.isArray(this.tableData?.selectedItems)
      ? this.tableData.selectedItems
      : this.tableData?.selectedItems
      ? [this.tableData.selectedItems]
      : [];
    this.calculateGrossAmount();
    this.calculateNetAmount();
  }

  calculateGrossAmount() {
    this.GrossAmount = this.orderList.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.unitPrice1 ?? item.rate) || 0;
      const total = qty * rate;
      item.total = Number(total.toFixed(2));
      return sum + total;
    }, 0);

    this.GrossAmount = Number(this.GrossAmount.toFixed(2));
    this.calculateNetAmount();
  }

  calculateNetAmount() {
    const gross = Number(this.GrossAmount || 0);
    const discount = Number(this.Discount || 0);

    const grossAfterDiscount = gross - discount;
    const vatRate = 0.05;
    const baseAmount = Number((grossAfterDiscount / (1 + vatRate)).toFixed(2));
    this.VatAmount = Number((baseAmount * vatRate).toFixed(2));

    this.NetAmount = baseAmount;
    this.TotalAmount = Number((this.NetAmount + this.VatAmount).toFixed(2));
  }

  closeForm() {
    this.modalCtrl.dismiss();
  }

  save() {
    if (!this.orderList.length) {
      this.messageService.show('No items to save.', 'danger');
      return;
    }

    const table = this.tableData?.NewtakeOder?.TakeNewtable || {};

    const totalAmount = this.orderList.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    const vatRate = 0.05;
    const vatAmt = +(totalAmount * vatRate).toFixed(2);
    const netAmount = +(totalAmount + vatAmt).toFixed(2);

    this.order = {
      id: 0,
      kotNo: '',
      orderNo: table.orderNo ?? null,
      tableId: table.id ? table.id : this.tableData?.table.id,
      tableName: table.name ?? '',
      area: this.tableData?.area ?? 'Main Hall',
      orderTypeId: 1,
      orderType: 'Dine-In',
      orderDateTime: new Date().toISOString(),
      orderBillDate: new Date().toISOString(),
      waiterId: null,
      driverId: null,
      roomId: null,
      isOrderCancel: false,
      isInvoicePrinted: false,
      paymentOptionId: null,
      cashPaid: 0,
      remarks: '',
      covers: this.pax ?? 0,
      orderComent: null,
      orderTime: new Date().toISOString(),
      status: 0,

      totalAmount: totalAmount,
      vatAmt: vatAmt,
      netAmount: netAmount,

      orderDetails: this.orderList.map((item: any) => ({
        itemMasterId: item.itemMasterId ?? item.itemId,
        itemName: item.itemName,
        qty: item.qty,
        rate: item.unitPrice1 ?? item.rate ?? 0,
        total: item.total ?? 0,
        itemNotes: item.itemNotes || [],
      })),

      settlementDetails: [
        {
          id: 0,
          trans_code: 'STOT',
          trans_Description: 'SUB TOTAL',
          taxable: false,
          amount: totalAmount,
        },
        {
          id: 0,
          trans_code: 'VAT',
          trans_Description: 'VAT',
          taxable: false,
          amount: vatAmt,
        },
        {
          id: 0,
          trans_code: 'NET',
          trans_Description: 'NET AMOUNT',
          taxable: false,
          amount: netAmount,
        },
      ],
    };

    this.Isloading = true;
    this.orderService.createOrder(this.order).subscribe({
      next: (res: any) => {
        this.Isloading = false;
        if (res?.isSuccess) {
          localStorage.removeItem('selectedItems');
          localStorage.removeItem('orderItems');
          localStorage.removeItem('orderTableId');
          this.messageService.show('Order saved successfully', 'success');
          this.modalCtrl.dismiss('reload');
        } else {
          this.messageService.show('Failed to save order.', 'danger');
        }
      },
      error: () => {
        this.Isloading = false;
        this.messageService.show('Server error while saving order.', 'danger');
      },
    });
  }

  openBack() {
    this.modalCtrl.dismiss();
  }
}
