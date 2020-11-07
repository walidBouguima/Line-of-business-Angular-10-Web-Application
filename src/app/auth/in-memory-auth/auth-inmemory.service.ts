import { Injectable } from '@angular/core'
import { sign } from 'fake-jwt-sign'
import { Observable, of, throwError } from 'rxjs'
import { PhoneType, User } from 'src/app/user/user'

import { Role } from '../auth.enum'
import { AuthService, IAuthStatus, IServerAuthResponse } from '../auth.service'

@Injectable()
export class InMemoryAuthService extends AuthService {
  constructor() {
    super()
  }
  private defaultUser = User.Build({
    _id: '5da01751da27cc462d265913',
    email: 'walid.bouguima@gmail.com.com',
    name: { first: 'Walid', last: 'Bouguima' },
    // picture: 'https://secure.gravatar.com/avatar/7cbaa9afb5ca78d97f3c689f8ce6c985',
    picture:
      'https://fr.gravatar.com/userimage/191438978/92ec935bf3f59299942f95a3ab446337',
    role: Role.Manager,
    dateOfBirth: new Date(1980, 1, 1),
    userStatus: true,
    address: {
      line1: '101 Sesame St.',
      city: 'Bethesda',
      state: 'Maryland',
      zip: '20810',
    },
    level: 2,
    phones: [
      {
        id: 0,
        type: PhoneType.Mobile,
        digits: '5555550717',
      },
    ],
  })
  protected authProvider(
    email: string,
    password: string
  ): Observable<IServerAuthResponse> {
    email = email.toLocaleLowerCase()
    if (!email.endsWith('@bouguima.com')) {
      return throwError('Failed to login! Email needs to end with @test.com !')
    }
    const authStatus = {
      isAuthenticated: true,
      userId: this.defaultUser._id,
      userRole: email.includes('cashier')
        ? Role.Cashier
        : email.includes('clerck')
        ? Role.Clerk
        : email.includes('manager')
        ? Role.Manager
        : Role.None,
    } as IAuthStatus

    this.defaultUser.role = authStatus.userRole

    const authResponse = {
      accessToken: sign(authStatus, 'secret', {
        expiresIn: '1h',
        algorithm: 'none',
      }),
    } as IServerAuthResponse
    return of(authResponse)
  }
  protected transformJwtToken(token: IAuthStatus): IAuthStatus {
    return token
  }
  protected getCurrentUser(): Observable<User> {
    return of(this.defaultUser)
  }
}
