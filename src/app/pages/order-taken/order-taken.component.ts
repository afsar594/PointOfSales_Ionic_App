import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular'; 
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-order-taken',
  templateUrl: './order-taken.component.html',
  styleUrls: ['./order-taken.component.scss'],
      standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class OrderTakenComponent  implements OnInit {
    searchText: string = '';

  onSearch() {
    console.log('Searching for:', this.searchText);
   }
  constructor(private modalCtrl: ModalController,
    private router: Router
  ) {}

  closeForm() {
    this.modalCtrl.dismiss();
  }
 
openItemDetail(item: any) {
  this.router.navigate(['/pages/additem'], { state: { data: item } });
}
async openItemDialog(item: any) {
  const modal = await this.modalCtrl.create({
    component: AddItemComponent,
    componentProps: { item },
    cssClass: 'custom-dialog'  
  });
  await modal.present();
}
menuItems = [
  {
    image: 'assets/img/food1.jpg',
    title: 'Maggi / Mee / Bihun / KueyTeow'
  },
  {
    image: 'assets/img/food2.jpg',
    title: 'Roti / Tosai / Chapati'
  },
  {
    image: 'assets/img/food8.jpg',
    title: 'Maggi / Mee / Bihun / KueyTeow'
  },
  {
    image: 'assets/img/food4.jpg',
    title: 'Roti / Tosai / Chapati'
  },
  {
    image: 'assets/img/food6.jpg',
    title: 'Maggi / Mee / Bihun / KueyTeow'
  },
  {
    image: 'assets/img/food7.jpg',
    title: 'Roti / Tosai / Chapati'
  }
];

 
  ngOnInit() {}

}
