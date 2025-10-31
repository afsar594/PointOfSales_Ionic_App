import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  standalone: true, // 👈 mark as standalone
  imports: [IonicModule, CommonModule], // 👈 add IonicModule + CommonModule here

  selector: 'app-show-all-orders',
  templateUrl: './show-all-orders.component.html',
  styleUrls: ['./show-all-orders.component.scss'],
})
export class ShowAllOrdersComponent implements OnInit {
  @Input() orders: any[] = [];
  @Input() tableName = '';

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    console.log('Orders received:', this.orders);
  }

  close() {
    this.modalCtrl.dismiss();
  }
  selectOrder(order: any) {
    this.modalCtrl.dismiss(order); // pass selected order back
  }
}
