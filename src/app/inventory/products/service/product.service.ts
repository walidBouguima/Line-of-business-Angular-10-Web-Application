import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { product } from '../interfaces/products.interfaces'

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  rootUrl = 'http://localhost:3000/product'
  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  addNewProduct(product: product) {
    return this.http.post<product>(this.rootUrl, product)
  }
  // tslint:disable-next-line: typedef
  getProducts() {
    return this.http.get<product[]>(this.rootUrl)
  }
  // tslint:disable-next-line: typedef
  getProduct(id: number) {
    return this.http.get<product>(`${this.rootUrl}/${id}`)
  }
  // tslint:disable-next-line: typedef
  getProductsByCategory(params: string) {
    return this.http.get<product[]>(this.rootUrl, {
      params: new HttpParams().set('category', params),
    })
  }
  // tslint:disable-next-line: typedef
  deleteProduct(id: number) {
    return this.http.delete(`${this.rootUrl}/${id}`)
  }
  // tslint:disable-next-line: typedef
  updateProduct(id: number, product: product) {
    return this.http.put<product>(`${this.rootUrl}/${id}`, product)
  }

  // tslint:disable-next-line: typedef
  searchProduct(term: string) {
    return this.http.get<product[]>(this.rootUrl, {
      params: new HttpParams().set('q', term),
    })
  }
}
