import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'

import { IUser } from '../user/user'
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
export abstract class AuthService {
  constructor() {}
}
