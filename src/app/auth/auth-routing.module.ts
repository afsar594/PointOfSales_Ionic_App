import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PincodeComponent } from './pincode/pincode.component';

const routes: Routes = [
    {
    path: 'login', 
    component: LoginComponent
  },
   {
    path: 'pincode', 
    component: PincodeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
