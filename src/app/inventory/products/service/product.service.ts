import { HttpClient, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'

// tslint:disable-next-line: class-name
export interface products {
  id: number
  name: string
  category: string
  imageUrl: string
  price: number
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  rootUrl = 'http://localhost:3000/products'
  constructor(private http: HttpClient) {}

  // tslint:disable-next-line: typedef
  addNewProduct(product: products) {
    return this.http.post<products>(this.rootUrl, product)
  }
  // tslint:disable-next-line: typedef
  getProducts(id: number) {
    return this.http.get<products[]>(this.rootUrl)
  }
  // tslint:disable-next-line: typedef
  getProduct(id: number) {
    return this.http.get<products>(`${this.rootUrl}/${id}`)
  }
  // tslint:disable-next-line: typedef
  getProductsByCategory(params: string) {
    return this.http.get<products[]>(this.rootUrl, {
      params: new HttpParams().set('category', params),
    })
  }
  // tslint:disable-next-line: typedef
  deleteProduct(id: number) {
    return this.http.delete(`${this.rootUrl}/${id}`)
  }
  // tslint:disable-next-line: typedef
  updateProduct(id: number, product: products) {
    return this.http.put<products>(`${this.rootUrl}/${id}`, product)
  }

  // tslint:disable-next-line: typedef
  searchProduct(term: string) {
    return this.http.get<products[]>(this.rootUrl, {
      params: new HttpParams().set('q', term),
    })
  }
}
