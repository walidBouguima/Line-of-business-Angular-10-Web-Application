import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

import { IUser, User } from '../user/user'
import { Role } from './auth.enum'

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
export abstract class AuthService implements IAuthService {
  readonly authStatus$ = new BehaviorSubject<IAuthStatus>(defaultAuthStatus)
  readonly currentUser$ = new BehaviorSubject<IUser>(new User())

  constructor() {}

  login(email: string, password: string): Observable<void> {
    throw new Error('Not yet implemented')
  }
  logout(clearToken?: boolean): void {
    throw new Error('Not yet implemented')
  }
  getToken(): string {
    throw new Error('Not yet implemented')
  }
}
