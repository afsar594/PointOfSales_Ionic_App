import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  searchText: string = '';
  @Input() tableData: any;

  itemStore: any[] = [];
  GroupData: any[] = [];
  selectedCatGroup: any[] = [];
  isLoading: boolean = true;

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private generalAPI: GeneralItemsService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.GetCategoryWithItems();
  }

  GetCategoryWithItems() {
    this.generalAPI.GetCategoryWithItems({}).subscribe((r: any) => {
      this.GroupData = r.data;
      this.selectedCatGroup = this.extractGroups(r.data);
      this.isLoading = false;
    });
  }

  onSearch(event: any) {
    const query = event.target.value?.toLowerCase() || '';
    if (!query) {
      this.selectedCatGroup = this.extractGroups(this.GroupData);
    } else {
      this.selectedCatGroup = this.extractGroups(this.GroupData).filter(
        (group) => group.groupName.toLowerCase().includes(query)
      );
    }
  }

  openItemDetail(item: any) {
    this.router.navigate(['/pages/additem'], { state: { data: item } });
  }

  async openItemDialog(item: any) {
    const modal = await this.modalCtrl.create({
      component: OrderTakenComponent,
      componentProps: { itemStore: item },
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
}
