import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DineInTableComponent } from './dine-in-table/dine-in-table.component';
import { OrderTakenComponent } from './order-taken/order-taken.component';
import { AddItemComponent } from './add-item/add-item.component';
import { AddRemarksComponent } from './add-remarks/add-remarks.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
     {
      path: 'dineintable', 
      component: DineInTableComponent
    },
        {
      path: 'ordertaken', 
      component: OrderTakenComponent
    },
          {
      path: 'additem', 
      component: AddItemComponent
    },
            {
      path: 'addremarks', 
      component: AddRemarksComponent
    },
           {
      path: 'orderlist', 
      component: OrderListComponent
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { 
  
}
