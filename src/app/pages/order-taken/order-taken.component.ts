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

  // ✅ Store all selected items here
  itemStore: any[] = [];

  selectedCatItem: any[] = [];
  GroupData: any[] = [];
  selectedCatGroup: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private router: Router,
    private generalAPI: GeneralItemsService,

  ) {}

  ngOnInit() {
    this.GetCategoryWithItems();
  }

  onSearch() {
    console.log('Searching for:', this.searchText);
  }

  closeForm() {
    this.modalCtrl.dismiss();
  }

  openItemDetail(item: any) {
    this.router.navigate(['/pages/additem'], { state: { data: item } });
  }

   async openItemDialog(item: any) {
    const modal = await this.modalCtrl.create({
      component: AddItemComponent,
      componentProps: {
        tableData: item,
        itemStore: this.itemStore, 
      },
      cssClass: 'custom-dialog',
     });

     modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.itemStore = result.data; // ✅ keep all selected items
        console.log('✅ Updated itemStore:', this.itemStore);
      }
    });

    await modal.present();
  }
  openCancel(){
     this.modalCtrl.dismiss();
  }
 openBack() {
  this.router.navigateByUrl('/pages/dineintable');
}

  menuItems = [
    { image: 'assets/img/food1.jpg', title: 'Maggi / Mee / Bihun / KueyTeow' },
    { image: 'assets/img/food2.jpg', title: 'Roti / Tosai / Chapati' },
    { image: 'assets/img/food8.jpg', title: 'Maggi / Mee / Bihun / KueyTeow' },
    { image: 'assets/img/food4.jpg', title: 'Roti / Tosai / Chapati' },
    { image: 'assets/img/food6.jpg', title: 'Maggi / Mee / Bihun / KueyTeow' },
    { image: 'assets/img/food7.jpg', title: 'Roti / Tosai / Chapati' },
  ];

  GetCategoryWithItems() {
    let req = {};
    this.generalAPI.GetCategoryWithItems(req).subscribe((r: any) => {
      this.GroupData = r.data;
      this.selectedCatItem = this.extractItems(r.data);
      this.selectedCatGroup = this.extractGroups(r.data);
    });
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
