import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { GeneralItemsService } from 'src/app/services/general-items.service';
import { OrderTakenComponent } from '../order-taken/order-taken.component';

@Component({
  selector: 'app-group-item',
  templateUrl: './group-item.component.html',
  styleUrls: ['./group-item.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class GroupItemComponent implements OnInit {
  @Input() tableData: any;
  @Input() data: any;
  searchText: string = '';
  isLoading: boolean = true;

  GroupData: any[] = [];
  selectedCatGroup: any[] = [];

  itemStore: any = {
    existingItems: [],
    tableId: null,
  };

  constructor(
    private modalCtrl: ModalController,
    private generalAPI: GeneralItemsService
  ) {}

  ngOnInit() {
    console.log('comming value in group', this.data);
    console.log('tableData', this.tableData);
    this.isLoading = true;

    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    const savedTableId = localStorage.getItem('orderTableId');

    this.itemStore.existingItems = savedItems;
    this.itemStore.tableId = savedTableId || this.tableData?.Id;

    this.GetCategoryWithItems();
  }

  GetCategoryWithItems() {
    this.generalAPI.GetCategoryWithItems({}).subscribe((res: any) => {
      this.GroupData = res.data || [];
      this.selectedCatGroup = this.extractGroups(this.GroupData);
      this.isLoading = false;
    });
  }

  onSearch(event: any) {
    const value = event.target.value?.toLowerCase() || '';

    this.selectedCatGroup = value
      ? this.extractGroups(this.GroupData).filter((x) =>
          x.groupName.toLowerCase().includes(value)
        )
      : this.extractGroups(this.GroupData);
  }

  async openItemDialog(group: any) {
    const modal = await this.modalCtrl.create({
      component: OrderTakenComponent,
      componentProps: {
        itemStore: this.itemStore,
        groupData: group,
        NewtakeOder: this.data,
        table: this.tableData,
      },
      cssClass: 'custom-dialog',
    });

    modal.onDidDismiss().then((res: any) => {
      if (res?.data?.existingItems) {
        this.itemStore.existingItems = res.data.existingItems;
        localStorage.setItem(
          'orderItems',
          JSON.stringify(res.data.existingItems)
        );
        localStorage.setItem('orderTableId', this.itemStore.tableId);
      }
    });

    await modal.present();
  }

  extractGroups(data: any[]) {
    return (data || []).flatMap((cat: any) =>
      (cat.groupCategories || []).map((grp: any) => ({
        groupId: grp.groupId,
        groupName: grp.groupName,
        items: (grp.categoryItems || []).map((item: any) => ({
          itemId: item.itemId,
          itemName: item.itemName,
          qty: 1,
          unitPrice1: item.unitPrice1 ?? item.unitPrice ?? item.rate ?? 0,
          itemNotes: [],
        })),
      }))
    );
  }

  openBack() {
    this.modalCtrl.dismiss();
  }

  openCancel() {
    const savedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    this.modalCtrl.dismiss({ existingItems: savedItems });
  }
}
