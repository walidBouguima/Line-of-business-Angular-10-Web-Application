import { Component, OnDestroy, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { SubSink } from 'subsink'

import { cartData } from '../products/interfaces/products.interfaces'
import { CartService } from '../products/service/cart.service'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  cartProducts: cartData[] = []
  subs = new SubSink()
  constructor(private cartService: CartService, private toastr: ToastrService) {}
  ngOnInit(): void {
    this.subs.add(
      this.cartService.getCart().subscribe((res) => {
        this.cartProducts = res

        this.cartService.nuOfCartItems$.next(res.length)
      })
    )
    this.totalPrice
  }
  onDeleteCart(product: cartData) {
    this.subs.add(
      this.cartService.deleteCart(product.id).subscribe(() => {
        this.toastr.success('Item deleted from cart', 'Deleted!')
        this.cartService.getCart().subscribe((res) => {
          this.cartProducts = res

          this.cartService.nuOfCartItems$.next(res.length)
        })
      })
    )
  }
  onUpdateCart(quantity: number, index: number) {
    const cartData = {
      id: this.cartProducts[index].id,
      quantity,
      name: this.cartProducts[index].name,
      price: this.cartProducts[index].price,
      imageUrl: this.cartProducts[index].imageUrl,
    }
    this.subs.add(
      this.cartService.updateCart(this.cartProducts[index].id, cartData).subscribe(() => {
        this.toastr.success('Cart updated', 'Success!')
        this.cartService.getCart().subscribe((res) => {
          this.cartProducts = res
        })
      })
    )
  }
  get totalPrice() {
    const res = this.cartProducts.reduce((sum, item) => {
      return item.quantity * item.price + sum
    }, 0)

    return res
  }
  ngOnDestroy() {
    this.subs.unsubscribe()
  }
}
