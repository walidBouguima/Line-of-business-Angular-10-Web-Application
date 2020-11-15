import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { ToastrService } from 'ngx-toastr'
import { AuthService } from 'src/app/auth/auth.service'
import { SubSink } from 'subsink'

import { cartData, product } from './interfaces/products.interfaces'
import { ProductService } from './service/product.service'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  subs = new SubSink()
  product = 1
  categoryForm = new FormGroup({
    category: new FormControl(''),
  })

  products: product[] = []
  isLoggedIn: boolean
  addToCart: number

  numberOfItemsInCart: number
  cartItems: cartData[] = []

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.categoryForm.valueChanges.subscribe((value) => {
        if (
          value.category === 'bread' ||
          value.category === 'pulses and beans' ||
          value.category === 'fruits' ||
          value.category === 'vegtables'
        ) {
          this.productService.getProductsByCategory(value.category).subscribe((res) => {
            this.products = res
          })
        } else {
          this.productService.getProducts().subscribe((res) => {
            this.products = res
          })
        }
      })
    )
    this.subs.add(
      this.productService.getProducts().subscribe((res) => {
        this.products = res
      })
    )
    // check authentication status
    this.subs.add()
    // cget user cart data
    this.subs.add()
  }
}
