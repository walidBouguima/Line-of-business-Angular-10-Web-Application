import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs'
import { baseUrl } from 'src/app/common/baseUrl'

import { cartData, shippingAdd } from '../interfaces/products.interfaces'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  nuOfCartItems$ = new Subject<number>()
  isCheckedOut$ = new Subject<boolean>()
  isPlacedOrder$ = new Subject<boolean>()
  orderPlaced$ = new ReplaySubject<shippingAdd>()
  cart: any = {}
  cart$: any
  baseUrl1 = `${baseUrl}cart`
  baseUrl2 = `${baseUrl}orders`
  constructor(private http: HttpClient) {
    this.cart.cartTotal = 0
    this.cart$ = new BehaviorSubject(this.cart)
  }

  addToCart(count: any, product: any) {
    if (count === 0) {
      delete this.cart[product._id]
    } else {
      this.cart = {
        ...this.cart,
        [product._id]: {
          ...product,
          count,
        },
      }
      return this.http.post(`${this.baseUrl1}/`, product)
    }
    this.cart.cartTotal = 0
    Object.values(this.cart)
      .filter((x) => typeof x === 'object')
      .forEach((p: any) => (this.cart.cartTotal = this.cart.cartTotal + p.count))
    this.cart$.next(this.cart)
  }

  getCart() {
    return this.http.get<cartData[]>(this.baseUrl1)
  }
  deleteCart(id: number) {
    return this.http.delete(`${this.baseUrl1}/${id}`)
  }
  updateCart(id: number, cartData: cartData) {
    return this.http.put<cartData>(`${this.baseUrl1}/${id}`, cartData)
  }
}
