import { Injectable } from '@angular/core'
import * as decode from 'jwt-decode'
import { BehaviorSubject, Observable, throwError } from 'rxjs'
import { catchError, filter, flatMap, map, tap } from 'rxjs/operators'

import { transformError } from '../common/common'
import { IUser, User } from '../user/user'
import { Role } from './auth.enum'
import { CacheService } from './cache.service'

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

@Injectable()
export abstract class AuthService extends CacheService implements IAuthService {
  constructor() {
    super()
  }

  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus)
  readonly currentUser$ = new BehaviorSubject<IUser>(new User())

  // Abstract protected methods that will not be available publically but inhereted by the derived classes to implement the auth workflow
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
        const token = decode(value.accessToken)
        return this.transformJwtToken(token)
      }),
      tap((status) => this.authStatus$.next(status)),
      filter((status: IAuthStatus) => status.isAuthenticated),
      // tslint:disable-next-line: deprecation
      flatMap(() => this.getCurrentUser()),
      map((user) => this.currentUser$.next(user)),
      catchError(transformError)
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
    setTimeout(() => this.authStatus$.next(defaultAuthStatus), 0)
  }
  protected setToken(jwt: string) {
    this.setItem('jwt', jwt)
  }
  getToken(): string {
    return this.getItem('jwt') ?? ''
  }
  protected clearToken() {
    this.removeItem('jwt')
  }
}
