import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-order-taken',
  templateUrl: './order-taken.component.html',
  styleUrls: ['./order-taken.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class OrderTakenComponent implements OnInit {
  @Input() itemStore: any;
  @Input() groupData: any;
  @Input() NewtakeOder: any;
  @Input() table: any;

  selectedCatItem: any[] = [];
  filteredItems: any[] = [];
  isLoading: boolean = true;
  searchText: string = '';
  mergedCount: number = 0;

  constructor(private modalCtrl: ModalController, private router: Router) {}

  ngOnInit() {
    const storedItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
    const items = this.groupData?.items || [];

    this.selectedCatItem = items.map((it: { itemId: any; unitPrice1: any }) => {
      const exist = storedItems.find((x: any) => x.itemId === it.itemId);
      return {
        ...it,
        selected: !!exist,
        qty: exist?.qty || 1,
        unitPrice1: exist?.unitPrice1 ?? it.unitPrice1,
        total: Number(
          ((exist?.unitPrice1 ?? it.unitPrice1) * (exist?.qty || 1)).toFixed(2)
        ),
        itemNotes: exist?.itemNotes ? [...exist.itemNotes] : [],
      };
    });

    this.filteredItems = [...this.selectedCatItem];
    this.isLoading = false;
    this.updateMergedCount();
  }

  toggleSelection(item: any) {
    item.selected = !item.selected;
    this.updateMergedCount();
  }

  hasSelection(): boolean {
    return this.selectedCatItem.some((x) => x.selected);
  }

  onSearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.filteredItems = this.selectedCatItem.filter((item: any) =>
      item.itemName.toLowerCase().includes(value)
    );
  }

  updateMergedCount() {
    const saved = JSON.parse(localStorage.getItem('orderItems') || '[]');
    const selectedNow = this.selectedCatItem.filter((x) => x.selected);
    const merged = [
      ...new Map([...saved, ...selectedNow].map((v) => [v.itemId, v])).values(),
    ];
    this.mergedCount = merged.length;
  }

  private saveToLocalStorage() {
    const selectedNow = this.selectedCatItem
      .filter((x) => x.selected)
      .map((x) => ({
        itemId: x.itemId,
        itemName: x.itemName,
        qty: x.qty,
        unitPrice1: x.unitPrice1,
        total: Number((x.qty * x.unitPrice1).toFixed(2)),
        itemNotes: x.itemNotes || [],
      }));

    const saved = JSON.parse(localStorage.getItem('orderItems') || '[]');

    const merged = [
      ...new Map([...saved, ...selectedNow].map((v) => [v.itemId, v])).values(),
    ];

    localStorage.setItem('orderItems', JSON.stringify(merged));

    this.updateMergedCount();
    return merged;
  }

  async openItemDialog() {
    const merged = this.saveToLocalStorage();

    const modal = await this.modalCtrl.create({
      component: AddItemComponent,
      componentProps: {
        itemStore: {
          existingItems: merged,
          tableId: this.itemStore.tableId,
          NewtakeOder: this.NewtakeOder,
          table: this.table,
        },
      },
    });

    modal.onDidDismiss().then((res) => {
      if (res?.data?.existingItems) {
        localStorage.setItem(
          'orderItems',
          JSON.stringify(res.data.existingItems)
        );
        this.modalCtrl.dismiss({ existingItems: res.data.existingItems });
      }
    });

    await modal.present();
  }

  openBack() {
    this.saveToLocalStorage();
    this.modalCtrl.dismiss({ back: true });
  }

  openCancel() {
    localStorage.removeItem('orderItems');
    localStorage.removeItem('orderTableId');
    this.modalCtrl.dismiss();
  }
}
