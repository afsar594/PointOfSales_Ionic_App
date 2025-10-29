import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeneralItemsService } from 'src/app/services/general-items.service';
import { ToastService } from 'src/app/services/toast.service';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-merge-table',
  templateUrl: './merge-table.component.html',
  styleUrls: ['./merge-table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class MergeTableComponent implements OnInit {
  @Input() config: any; // ✅ Added correct Input reference

  orderTables: any[] = [];
  selectedOrdersData: any[] = [];
  mergeOrderIds: string = '';

  constructor(
    public orderService: GeneralItemsService,
    private modalCtrl: ModalController,
    private messageService: ToastService
  ) {}

  ngOnInit() {
    if (!this.config || !this.config.data) {
      console.warn('⚠ MergeTableComponent: Missing config input');
      return;
    }
    this.getAllOrder();
  }

  getAllOrder() {
    const queryParams = {
      pageNumber: 1,
      pageSize: 30,
      searchTerm: '',
      sortColumn: '',
      sortDirection: '',
      selectionFormula: 'Status = 1 , OrderTypeId = 4',
    };

    this.orderService.getAllOrders(queryParams).subscribe({
      next: (res: any) => {
        this.orderTables = [];

        res.data?.forEach((item: any) => {
          if (!this.checkOrderIds(item.id) && item.status == 1) {
            this.orderTables.push({
              pendingOrderId: item.id,
              table: item.tableName,
              selected: false,
              orderDetails: item.orderDetails,
              settlementDetails: item.settlementDetails,
            });
          }
        });
      },
      error: () => {
        this.messageService.show('Failed to load orders.', 'danger');
      },
    });
  }

  checkOrderIds(orderId: number): boolean {
    const selectedId = this.config.data.id;
    const mergeOrderIds = this.config.data.mergeOrderId;
    let idArray: number[] = [];

    if (mergeOrderIds) {
      idArray = mergeOrderIds
        .split(',')
        .map((item: string) => parseInt(item.trim(), 10));
      idArray.push(selectedId);
    } else {
      idArray = [selectedId];
    }

    return idArray.includes(orderId);
  }

  toggleSelectTable(table: any) {
    table.selected = !table.selected;
    this.selectedOrdersData = this.orderTables.filter((t) => t.selected);
  }

  resetTables() {
    this.orderTables.forEach((t) => (t.selected = false));
    this.selectedOrdersData = [];
  }

  mergeTables() {
    this.selectedOrdersData = this.orderTables.filter((t) => t.selected);

    if (this.selectedOrdersData.length === 0) {
      this.messageService.show('Please select at least one table', 'danger');
      return;
    }

    this.mergeOrderIds = this.selectedOrdersData
      .map((t) => t.pendingOrderId)
      .join(',');

    this.mergeOrders();
  }

  mergeOrders() {
    this.modalCtrl.dismiss({
      mergeOrderIds: this.mergeOrderIds,
      ordersData: this.selectedOrdersData,
    });
  }

  exit() {
    this.modalCtrl.dismiss();
  }
}
