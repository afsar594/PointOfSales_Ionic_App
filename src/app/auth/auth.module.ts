import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
 

@NgModule({
  declarations: [ ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ],
 })

export class AuthModule { }
