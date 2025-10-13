import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class OrderListComponent implements OnInit {
  @Input() itemStore: any;

  pax = 1;
  orderList: any;
  // orderList = [
  //   { name: 'Bihun Goreng (No Meat)', qty: 2, price: 4.5 },
  //   { name: 'Kuey Teow', qty: 1, price: 4.5 },
  //   { name: 'Maggi Goreng', qty: 1, price: 4.5 },
  // ];
  constructor(private modalController: ModalController) {}

  ngOnInit() {
    console.log('comming', this.itemStore);
    this.orderList = this.itemStore;
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
