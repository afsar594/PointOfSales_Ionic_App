import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddItemComponent } from '../add-item/add-item.component';
import { GeneralItemsService } from 'src/app/services/general-items.service';

@Component({
  selector: 'app-order-taken',
  templateUrl: './order-taken.component.html',
  styleUrls: ['./order-taken.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class OrderTakenComponent implements OnInit {
  searchText: string = '';
  @Input() tableData: any;

  itemStore: any[] = [];
  selectedCatItem: any[] = [];
  filteredItems: any[] = [];
  GroupData: any[] = [];
  selectedCatGroup: any[] = [];

  isLoading: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private generalAPI: GeneralItemsService
  ) {}

  ngOnInit() {
    console.log('tableData', this.tableData);
    this.isLoading = true;
    this.GetCategoryWithItems();
  }

  GetCategoryWithItems() {
    let req = {};
    this.generalAPI.GetCategoryWithItems(req).subscribe((r: any) => {
      this.GroupData = r.data;
      this.selectedCatItem = this.extractItems(r.data);
      this.filteredItems = [...this.selectedCatItem];
      this.selectedCatGroup = this.extractGroups(r.data);
      this.isLoading = false;
    });
  }

  onSearch(event: any) {
    const query = event.target.value?.toLowerCase() || '';
    if (!query) {
      this.filteredItems = [...this.selectedCatItem];
    } else {
      this.filteredItems = this.selectedCatItem.filter((item) =>
        item.itemName?.toLowerCase().includes(query)
      );
    }
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;
  }

  hasSelection(): boolean {
    return this.selectedCatItem.some((x) => x.selected);
  }

  goNext() {
    const selectedItems = this.selectedCatItem.filter((x) => x.selected);
    // const mergeObject = { ...this.tableData, ...selectedItems };
    console.log(selectedItems);
    return selectedItems;
  }

  openItemDetail(item: any) {
    this.router.navigate(['/pages/additem'], { state: { data: item } });
  }

  async openItemDialog() {
    const modal = await this.modalCtrl.create({
      component: AddItemComponent,
      componentProps: { itemStore: this.goNext() },
      cssClass: 'custom-dialog',
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.itemStore = result.data;
      }
    });

    await modal.present();
  }

  openCancel() {
    this.modalCtrl.dismiss();
  }

  openBack() {
    this.router.navigateByUrl('/pages/dineintable');
  }

  extractGroups(reportData: any[]) {
    return (reportData || [])?.flatMap((category: any) =>
      (category.groupCategories || []).map((group: any) => ({
        groupId: group.groupId,
        groupName: group.groupName,
        items: (group.categoryItems || []).map((item: any) => ({
          batchCode: item.batchCode,
          itemId: item.itemId,
          itemName: item.itemName,
          itemSize: item.itemSize,
          itemType: item.itemType,
          itemUnits: item.itemUnits || [],
          itemWiseDiscount: item.itemWiseDiscount,
          printerName: item.printerName,
          qty: item.qty,
          rate: item.rate,
          relativeNo: item.relativeNo,
          total: item.total,
          unitPrice: item.unitPrice,
          unitPrice1: item.unitPrice1,
          unitPrice2: item.unitPrice2,
        })),
      }))
    );
  }

  extractItems(reportData: any[]) {
    return (reportData || [])?.flatMap((category: any) =>
      (category.groupCategories || []).flatMap((group: any) =>
        (group.categoryItems || []).map((item: any) => ({
          batchCode: item.batchCode,
          itemId: item.itemId,
          itemName: item.itemName,
          itemSize: item.itemSize,
          itemType: item.itemType,
          itemUnits: item.itemUnits || [],
          itemWiseDiscount: item.itemWiseDiscount,
          printerName: item.printerName,
          qty: item.qty,
          rate: item.rate,
          relativeNo: item.relativeNo,
          total: item.total,
          unitPrice: item.unitPrice,
          unitPrice1: item.unitPrice1,
          unitPrice2: item.unitPrice2,
        }))
      )
    );
  }
}
