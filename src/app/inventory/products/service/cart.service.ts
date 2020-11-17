import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { ReplaySubject, Subject } from 'rxjs'
import { baseUrl } from 'src/app/common/baseUrl'

import { cartData, shippingAdd } from '../interfaces/products.interfaces'

@Injectable({
  providedIn: 'root',
})
export class CartService {
  nuOfCartItems$ = new Subject<number>()
  isPlacedOrder$ = new Subject<boolean>()
  orderPlaced$ = new ReplaySubject<shippingAdd>()

  baseUrl1 = `${baseUrl}cart`
  baseUrl2 = `${baseUrl}orders`
  constructor(private http: HttpClient) {}

  addToCart(cart: cartData) {
    return this.http.post(`${this.baseUrl1}/`, cart)
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
