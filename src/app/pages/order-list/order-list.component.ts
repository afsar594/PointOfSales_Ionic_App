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
    console.log('Incoming Table Data →', this.tableData);

    // ✅ Always enforce array
    this.orderList = Array.isArray(this.tableData?.selectedItems)
      ? this.tableData.selectedItems
      : this.tableData?.selectedItems
      ? [this.tableData.selectedItems]
      : [];

    console.log('OrderList →', this.orderList);

    this.calculateGrossAmount();
    this.calculateNetAmount();
  }

  calculateGrossAmount() {
    this.GrossAmount = this.orderList.reduce((sum, item) => {
      const qty = Number(item.qty) || 0;
      const rate = Number(item.unitPrice1 ?? item.rate) || 0;
      const total = qty * rate;
      item.total = Number(total.toFixed(2)); // ✅ keep item total updated
      return sum + total;
    }, 0);

    this.GrossAmount = Number(this.GrossAmount.toFixed(2));
    this.calculateNetAmount();
  }

  calculateNetAmount() {
    const gross = Number(this.GrossAmount || 0); // total including VAT
    const discount = Number(this.Discount || 0);

    // Apply discount before VAT calculation
    const grossAfterDiscount = gross - discount;

    // VAT % Default → 5%
    const vatRate = 0.05;

    // ✅ Back calculation
    const baseAmount = Number((grossAfterDiscount / (1 + vatRate)).toFixed(2));
    this.VatAmount = Number((baseAmount * vatRate).toFixed(2));

    // ✅ Net = base + VAT (or simply grossAfterDiscount)
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

    this.order = {
      kotNo: '',
      tableId: this.tableData?.tableId ?? null,
      orderTypeId: 1,
      orderType: 'Dine-In',
      orderNo: null,
      area: this.tableData?.area ?? '',
      tableName: this.tableData?.tableName ?? '',
      orderDetails: this.orderList.map((item: any) => ({
        itemMasterId: item.itemMasterId ?? item.itemId,
        itemName: item.itemName,
        qty: item.qty,
        rate: item.unitPrice1 ?? item.rate ?? 0,
        total: item.total,
        itemNotes: item.itemNotes || [],
      })),
      netAmount: this.NetAmount,
      vatAmt: this.VatAmount,
      totalAmount: this.TotalAmount,
      orderDateTime: new Date().toISOString(),
      waiterId: null,
      driverId: null,
      roomId: null,
      orderBillDate: new Date().toISOString(),
      isOrderCancel: false,
      isInvoicePrinted: false,
      paymentOptionId: null,
      cashPaid: 0,
      remarks: '',
      covers: this.pax,
      orderComent: null,
      orderTime: new Date().toISOString(),
      status: 0,
    };

    console.log('✅ Final Payload:', this.order);

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
  //   closeForm() {
  //   // close without refreshing parent
  //   this.modalCtrl.dismiss();
  // }

  openBack() {
    // just navigate back if needed
    // this.router.navigate(['ordertaken']);
    this.modalCtrl.dismiss();
  }
}
