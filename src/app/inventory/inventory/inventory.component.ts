import { Component, OnInit } from '@angular/core'
import { SubSink } from 'subsink'

import { CartService } from '../products/service/cart.service'

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css'],
})
export class InventoryComponent implements OnInit {
  nuOfCartItems!: number
  subs = new SubSink()

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.subs.add(
      this.cartService.nuOfCartItems$.subscribe((res) => {
        this.nuOfCartItems = res
      })
    )
  }
}
