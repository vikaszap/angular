import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderformComponent } from './orderform/orderform.component';

const routes: Routes = [
  { path: '', component: OrderformComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}