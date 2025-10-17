import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';

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

  constructor(private modalCtrl: ModalController, private router: Router) {}

  ngOnInit() {
    console.log('Incoming data:', this.tableData);

    // ensure orderList is always an array
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

  // ✅ Calculate total of all item totals
  calculateGrossAmount() {
    this.GrossAmount = this.orderList.reduce(
      (sum, item) => sum + (Number(item.total) || 0),
      0
    );
    this.GrossAmount = Number(this.GrossAmount.toFixed(2));
  }

  // ✅ Recalculate Net Amount whenever user changes VAT or Discount
  calculateNetAmount() {
    const gross = this.GrossAmount || 0;
    const vat = this.VatAmount || 0;
    const discount = this.Discount || 0;

    // Net = Gross + VAT - Discount
    this.NetAmount = Number((gross + vat - discount).toFixed(2));
  }

  closeForm() {
    this.modalCtrl.dismiss();
  }

  openBack() {
    this.router.navigate(['ordertaken']);
  }

  openCancel() {
    this.router.navigate(['/pages/ordertaken']);
  }
}
