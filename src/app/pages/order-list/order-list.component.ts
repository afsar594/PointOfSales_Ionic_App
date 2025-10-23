import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  GrossAmount: number = 0;
  VatAmount: number = 0;
  Discount: number = 0;
  NetAmount: number = 0;
  Isloading = false;
  order: any = {}; // ✅ Initialize order object

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private orderService: GeneralItemsService,
    private messageService: ToastService
  ) {}

  ngOnInit() {
    console.log('Incoming data:', this.tableData);

    if (Array.isArray(this.tableData)) {
      this.orderList = this.tableData;
    } else if (this.tableData) {
      this.orderList = [this.tableData];
    } else {
      this.orderList = [];
    }

    this.calculateGrossAmount();
    this.calculateNetAmount();
  }

  calculateGrossAmount() {
    this.GrossAmount = this.orderList.reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );
    this.GrossAmount = Number(this.GrossAmount.toFixed(2));
  }

  calculateNetAmount() {
    const gross = this.GrossAmount || 0;
    const vat = this.VatAmount || 0;
    const discount = this.Discount || 0;

    this.NetAmount = Number((gross + vat - discount).toFixed(2));
  }

  closeForm() {
    this.modalCtrl.dismiss();
  }

  openBack() {
    this.router.navigate(['ordertaken']);
  }

  // ✅ Corrected save() method
  save() {
    if (!this.orderList || this.orderList.length === 0) {
      return;
    }

    // ✅ Prepare order object for API
    this.order = {
      orderDetails: this.orderList,
      orderTypeId: 1,
      orderType: 'Dine-In',
      totalAmount: this.GrossAmount,
      vatAmount: this.VatAmount,
      discount: this.Discount,
      netAmount: this.NetAmount,
      orderBillDate: new Date().toISOString(),
      orderTime: new Date().toISOString(),
      isOrderCancel: false,
      isInvoicePrinted: false,
      settlementId: null,
      waiterId: null,
      driverId: null,
      roomId: null,
      paymentOptionId: null,
      creditCard: '',
      shiftId: null,
      orderTypeOption: '',
      status: 0,
      cgst: 0,
      igst: 0,
      svc: 0,
      munFees: 0,
      pax: this.pax,
    };
    this.Isloading = true;
    this.orderService.createOrder(this.order).subscribe({
      next: (response: { isSuccess: any }) => {
        if (response.isSuccess) {
          this.messageService.show('Order saved successfully', 'success');
          this.Isloading = false;
          if (this.order.orderType === 'Dine-In') {
            this.router.navigate(['/pages/dineintable']);
            this.modalCtrl.dismiss();
          } else {
            this.router.navigate(['/main']);
          }
        } else {
          this.messageService.show('Failed to save order.', 'danger');
          this.Isloading = false;
        }
      },
      error: (err: any) => {
        this.Isloading = false;

        this.messageService.show('Server error while saving order.', 'danger');
      },
    });
  }
}
