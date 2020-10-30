import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { InventoryHomeComponent } from './inventory-home/inventory-home.component'
import { InventoryComponent } from './inventory/inventory.component'
import { ProductsComponent } from './products/products.component'
import { StockEntryComponent } from './stock-entry/stock-entry.component'

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      { path: '', redirectTo: '/inventory/home', pathMatch: 'full' },
      { path: 'home', component: InventoryHomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'stock-entry', component: StockEntryComponent },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
