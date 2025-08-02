import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
          standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class OrderListComponent  implements OnInit {
pax = 1;

  orderList = [
    { name: 'Bihun Goreng (No Meat)', qty: 2, price: 4.50 },
    { name: 'Kuey Teow', qty: 1, price: 4.50 },
    { name: 'Maggi Goreng', qty: 1, price: 4.50 },
  ];
  constructor() { }

  ngOnInit() {}

}
