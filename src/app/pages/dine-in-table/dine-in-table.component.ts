import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OrderTakenComponent } from '../order-taken/order-taken.component';
import { ModalController } from '@ionic/angular'; 
import { TableService } from 'src/app/services/table.service';

@Component({
  selector: 'app-dine-in-table',
  templateUrl: './dine-in-table.component.html',
  styleUrls: ['./dine-in-table.component.scss'],
    standalone: true,
  imports: [CommonModule, FormsModule, IonicModule], 
})
export class DineInTableComponent  implements OnInit {
  tables: string[] = [
    'T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06',
    'T-07', 'T-08', 'T-09', 'T-10', 'T-11', 'T-12',
    'T-13', 'T-14', 'T-15', 'T-16', 'T-17', 'T-18'
  ];
  Alltables: any;

  constructor(private modalController: ModalController,
    private tableapi :TableService,
    
  ) {}
  closeForm() {
    this.modalController.dismiss();
  }
  async openModal() {
    const modal = await this.modalController.create({
      component:  OrderTakenComponent,
        cssClass: 'custom-width-modal'
    });
    modal.present();
 
  }
 
  ngOnInit() {
this.getAllTable()
  }
getAllTable(){
  let payload={
    areaId: null,
    areaName: "",
    tableId: null,
    tableName: "",
    orderType: "",
    orderNo: "",
    orderDateTime: "",
    waiterName: "",
    customerName: "",
    tableStatus: ""
}
  this.tableapi.getList(payload).subscribe((res:any) => {
  this.Alltables = res.data.flatMap((area: { areaTables: any[]; }) =>
  area.areaTables.map(table => ({
    name: table.tableName,
    Id: table.tableId
  }))
);

    console.log('this.Alltables',this.Alltables)
  })
}
}
