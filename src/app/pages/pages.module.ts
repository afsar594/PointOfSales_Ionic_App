import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {   HttpClientModule } from '@angular/common/http';
import { TableService } from '../services/table.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PagesRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
     IonicModule.forRoot(),
HttpClientModule  ],
providers: [TableService]
})
export class PagesModule { }
