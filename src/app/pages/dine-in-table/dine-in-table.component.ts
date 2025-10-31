import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { TableService } from 'src/app/services/table.service';
import { GroupItemComponent } from '../group-item/group-item.component';
import { PopoverController } from '@ionic/angular';
import { PopupComponent } from '../popup/popup.component';
import { ShowAllOrdersComponent } from '../show-all-orders/show-all-orders.component';

@Component({
  selector: 'app-dine-in-table',
  templateUrl: './dine-in-table.component.html',
  styleUrls: ['./dine-in-table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class DineInTableComponent implements OnInit {
  showTime = false;
  showAmount = false;

  tables: string[] = [
    'T-01',
    'T-02',
    'T-03',
    'T-04',
    'T-05',
    'T-06',
    'T-07',
    'T-08',
    'T-09',
    'T-10',
    'T-11',
    'T-12',
    'T-13',
    'T-14',
    'T-15',
    'T-16',
    'T-17',
    'T-18',
  ];
  Alltables: any;
  async presentPopover(ev: any, table: any) {
    const popover = await this.popoverCtrl.create({
      component: PopupComponent,
      event: ev,
      translucent: true,
      componentProps: { table: table, even: ev },
    });
    popover.onDidDismiss().then((result) => {
      // child may request reload (after finishing order) or nothing
      if (result?.data === 'reload') {
        this.getAllTable();
      }
    });
    await popover.present();
  }
  constructor(
    private modalController: ModalController,
    private tableapi: TableService,
    private popoverCtrl: PopoverController
  ) {}

  closeForm() {
    this.modalController.dismiss();
  }

  async openModal(table: any) {
    const modal = await this.modalController.create({
      component: GroupItemComponent,
      cssClass: 'custom-width-modal',
      componentProps: {
        tableData: table,
      },
    });

    modal.onDidDismiss().then((result) => {
      // child may request reload (after finishing order) or nothing
      if (result?.data === 'reload') {
        this.getAllTable();
      }
    });

    await modal.present();
  }

  ngOnInit() {
    this.getAllTable();
  }

  getAllTable() {
    const payload = {
      areaId: null,
      areaName: '',
      tableId: null,
      tableName: '',
      orderType: '',
      orderNo: '',
      orderDateTime: '',
      waiterName: '',
      customerName: '',
      tableStatus: '',
    };

    this.tableapi.getList(payload).subscribe((res: any) => {
      this.Alltables = res.data.flatMap((area: any) =>
        area.areaTables.map((table: any) => ({
          name: table.tableName,
          id: table.tableId,
          backColor: table.tableBackColor,
          foreColor: table.tableForeColor,
          orders: table.tableOrders || [], // 👈 keep all orders
          orderNo: table.tableOrders?.[0]?.orderNo || '',
        }))
      );
    });
  }
  async openOrdersModal(table: any) {
    const modal = await this.modalController.create({
      component: ShowAllOrdersComponent, // 👈 your modal component
      cssClass: 'custom-width-modal',
      componentProps: { orders: table.orders, tableName: table.name },
    });
    await modal.present();
  }
  hasValidOrder(table: any): boolean {
    const orders = table.orders || [];

    // Condition: show ellipsis only if there is exactly one valid order
    if (orders.length === 1) {
      const order = orders[0];
      return !!(order?.orderId && order?.orderNo);
    }

    // If multiple orders, do not show ellipsis
    return false;
  }
}
