import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, NgForm } from '@angular/forms'
import { Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { AuthService, IAuthStatus } from 'src/app/auth/auth.service'
import { SubSink } from 'subsink'

import { cartData, product } from './interfaces/products.interfaces'
import { CartService } from './service/Cart.service'
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
  isLoggedIn!: IAuthStatus
  addToCart!: number

  numberOfItemsInCart!: number
  cartItems: cartData[] = []

  constructor(
    private toastr: ToastrService,
    private productService: ProductService,
    private auth: AuthService,
    private cartService: CartService,
    private router: Router
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
    this.subs.add(
      this.auth.authStatus$.subscribe((loggedIn) => {
        this.isLoggedIn = loggedIn
      })
    )
    // get user cart data
    this.subs.add(
      this.cartService.getCart().subscribe((res) => {
        this.cartItems = res
        this.numberOfItemsInCart = res.length
        this.cartService.nuOfCartItems$.next(this.numberOfItemsInCart)
      })
    )
  }
  onAddToCart(index: number) {
    const res = this.cartItems.find((item) => {
      return this.products[index].id === item.id
    })
    if (res && this.isLoggedIn) {
      this.toastr.warning('Item already exists in the cart', 'Duplicate item!')
    } else if (this.isLoggedIn) {
      this.addToCart = index
    } else {
      this.router.navigateByUrl('/login')
    }
  }
  buy(product: product, form: NgForm) {
    this.addToCart = -1
    const cartData = {
      id: product.id,
      quantity: form.value.quantity,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
    }

    this.subs.add(
      this.cartService.addToCart(cartData).subscribe(() => {
        this.toastr.success('Success', 'Item added to cart successfully')
        this.cartService.nuOfCartItems$.next(this.numberOfItemsInCart + 1)
      })
    )
  }
  ngOnDestroy() {
    this.subs.unsubscribe()
  }
}
