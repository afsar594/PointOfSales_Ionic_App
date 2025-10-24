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
  GrossAmount = 0;
  VatAmount = 0;
  Discount = 0;
  NetAmount = 0;
  TotalAmount = 0;
  Isloading = false;
  order: any = {};

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private orderService: GeneralItemsService,
    private messageService: ToastService
  ) {}

  ngOnInit() {
    console.log('bb', this.tableData);
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

    this.NetAmount = Number((gross - discount).toFixed(2));
    this.TotalAmount = Number((this.NetAmount + vat).toFixed(2));
  }

  closeForm() {
    this.modalCtrl.dismiss();
  }

  openBack() {
    this.router.navigate(['ordertaken']);
  }

  // ✅ Final Corrected save() method
  save() {
    if (!this.orderList || this.orderList.length === 0) {
      // this.messageService.show('No items to save.', 'warning');
      return;
    }

    // ✅ Build settlement details (default structure)
    const settlementDetails = [
      {
        id: 0,
        trans_code: 'STOT',
        trans_Description: 'SUB TOTAL',
        taxable: false,
        show_in_inv: true,
        main_Group: 'INCOME',
        amount: this.GrossAmount,
        transactionCodeMasterId: 170,
        transcode: 'STOT',
        showInGrid: true,
      },
      {
        id: 0,
        trans_code: 'DIS',
        trans_Description: 'DISCOUNT',
        taxable: true,
        show_in_inv: true,
        main_Group: 'INCOME',
        amount: this.Discount,
        transactionCodeMasterId: 37,
        transcode: 'DIS',
        showInGrid: this.Discount > 0,
      },
      {
        id: 0,
        trans_code: 'BIL',
        trans_Description: 'BILL AMOUNT',
        taxable: false,
        show_in_inv: true,
        main_Group: 'INCOME',
        amount: this.NetAmount,
        transactionCodeMasterId: 18,
        transcode: 'BIL',
        showInGrid: true,
      },
      {
        id: 0,
        trans_code: 'VAT',
        trans_Description: 'VAT',
        taxable: false,
        show_in_inv: true,
        main_Group: 'INCOME',
        amount: this.VatAmount,
        transactionCodeMasterId: 104,
        transcode: 'VAT',
        showInGrid: this.VatAmount > 0,
      },
      {
        id: 0,
        trans_code: 'NET',
        trans_Description: 'NET AMOUNT',
        taxable: false,
        show_in_inv: true,
        main_Group: 'INCOME',
        amount: this.TotalAmount,
        transactionCodeMasterId: 101,
        transcode: 'NET',
        showInGrid: true,
      },
    ];

    this.order = {
      kotNo: '',
      tableId: this.tableData?.tableId ?? null,
      orderTypeId: 1,
      orderType: 'Dine-In',
      orderNo: null,
      area: this.tableData?.area ?? '',
      tableName: this.tableData?.tableName ?? '',
      //  settlementDetails,
      orderDetails: this.orderList.map((item: any) => ({
        itemMasterId: item.itemMasterId,
        itemName: item.itemName,
        qty: item.qty,
        rate: item.rate,
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
      orderIdByOrderDate: null,
      settlementId: null,
      settlementDateTime: null,
      settlementBillDate: null,
      paymentOptionId: null,
      creditCard: '',
      staffAccount: null,
      cashPaid: 0,
      remarks: '',
      cityLedgerId: null,
      isPosted: false,
      balance: 0,
      guestNo: '',
      addedTable: '',
      charged: 0,
      covers: this.pax,
      orderComent: null,
      orderTime: new Date().toISOString(),
      changeBal: 0,
      totalTax: 0,
      alterUser: '',
      alterDateTime: new Date().toISOString(),
      shiftId: null,
      orderTypeOption: '',
      cancelUserId: null,
      orderDlvryStatus: false,
      status: 0,
      cgst: 0,
      igst: 0,
      svc: 0,
      munFees: 0,
      statusDelivery: 0,
    };

    console.log('🧾 Final Payload:', this.order);
    this.Isloading = true;
    this.orderService.createOrder(this.order).subscribe({
      next: (response: { isSuccess: boolean }) => {
        this.Isloading = false;
        if (response.isSuccess) {
          this.messageService.show('Order saved successfully', 'success');
          if (this.order.orderType === 'Dine-In') {
            this.router.navigate(['/pages/dineintable']);
            this.modalCtrl.dismiss();
          } else {
            this.router.navigate(['/main']);
          }
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
}
