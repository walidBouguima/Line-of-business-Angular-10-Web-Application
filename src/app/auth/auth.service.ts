import { Injectable } from '@angular/core'
import * as jwt_decode from 'jwt-decode'
import { BehaviorSubject, Observable, pipe, throwError } from 'rxjs'
import { catchError, filter, flatMap, map, tap } from 'rxjs/operators'

import { transformError } from '../common/common'
import { IUser, User } from '../user/user'
import { Role } from './auth.enum'
import { CacheService } from './cache.service'

@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  constructor() {
    super()
    if (this.hasExpiredToken()) {
      this.logout(true)
    } else {
      this.authStatus$.next(this.getAuthStatusFromToken())
      setTimeout(() => this.resumeCurrentUser$.subscribe(), 0)
    }
  }
  private getAndUpdateUserIfAuthenticated = pipe(
    filter((status: IAuthStatus) => status.isAuthenticated),
    // tslint:disable-next-line: deprecation
    flatMap(() => this.getCurrentUser()),
    map((user: IUser) => this.currentUser$.next(user)),
    catchError(transformError)
  )
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus)
  currentUser$ = new BehaviorSubject<IUser>(new User())
  // resume current user
  protected readonly resumeCurrentUser$ = this.authStatus$.pipe(
    this.getAndUpdateUserIfAuthenticated
  )
  protected abstract authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse>
  protected abstract transformJwtToken(token: unknown): IAuthStatus
  protected abstract getCurrentUser(): Observable<User>

  login(email: string, password: string): Observable<void> {
    this.clearToken()

    const loginResponse$ = this.authProvider(email, password).pipe(
      map((value) => {
        this.setToken(value.accessToken)

        // const token = decode(value.accessToken)
        // return this.transformJwtToken(token)
        return this.getAuthStatusFromToken()
      }),
      tap((status) => this.authStatus$.next(status)),
      this.getAndUpdateUserIfAuthenticated
    )
    loginResponse$.subscribe({
      error: (err) => {
        this.logout()
        return throwError(err)
      },
    })
    return loginResponse$
  }

  logout(clearToken?: boolean): void {
    if (clearToken) {
      this.clearToken()
    }
    setTimeout(() => {
      this.authStatus$.next(defaultAuthStatus)
    }, 0)
  }
  // tslint:disable-next-line: typedef
  protected setToken(jwt: string) {
    this.setItem('jwt', jwt)
  }
  getToken(): string {
    return this.getItem('jwt') ?? ''
  }
  // tslint:disable-next-line: typedef
  protected clearToken() {
    this.removeItem('jwt')
  }
  protected hasExpiredToken(): boolean {
    const jwt = this.getToken()
    if (jwt) {
      // tslint:disable-next-line: no-any
      const payload = jwt_decode(jwt) as any
      return Date.now() >= payload.exp * 1000
    }
    return true
  }
  protected getAuthStatusFromToken(): IAuthStatus {
    return this.transformJwtToken(jwt_decode(this.getToken()))
  }
}

export interface IAuthStatus {
  isAuthenticated: boolean
  userRole: Role
  userId: string
}
export interface IServerAuthResponse {
  accessToken: string
}

export const defaultAuthStatus: IAuthStatus = {
  isAuthenticated: false,
  userRole: Role.None,
  userId: '',
}

export interface IAuthService {
  readonly authStatus$: BehaviorSubject<IAuthStatus>
  readonly currentUser$: BehaviorSubject<IUser>
  login(email: string, password: string): Observable<void>
  logout(clearToken?: boolean): void
  getToken(): string
}
