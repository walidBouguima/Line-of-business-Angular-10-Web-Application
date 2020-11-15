import { Route } from '@angular/compiler/src/core'
import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
  RouterStateSnapshot,
} from '@angular/router'
import { Observable } from 'rxjs'
import { map, take } from 'rxjs/operators'

import { UiService } from '../common/ui.service'
import { Role } from './auth.enum'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {
  constructor(
    private uiService: UiService,
    protected authService: AuthService,
    protected router: Router
  ) {}

  canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkLogin()
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkLogin(route)
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkLogin(childRoute)
  }

  protected checkLogin(route?: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.authStatus$.pipe(
      map((authStatus) => {
        const roleMatch = this.checkRoleMatch(authStatus.userRole, route)
        const allowLogin = authStatus.isAuthenticated && roleMatch
        if (!allowLogin) {
          this.showAlert(authStatus.isAuthenticated, roleMatch)
          this.router.navigate(['login'], {
            queryParams: {
              redirectUrl: this.getResolvedUrl(route),
            },
          })
        }
        return allowLogin
      }),
      take(1) // complete the observable for the guard to work
    )
  }
  // tslint:disable-next-line: typedef
  private checkRoleMatch(role: Role, route?: ActivatedRouteSnapshot) {
    if (!route?.data?.expectedRole) {
      return true
    }
    return role === route.data.expectedRole
  }
  // tslint:disable-next-line: typedef
  private showAlert(isAuth: boolean, roleMatch: boolean) {
    if (!isAuth) {
      this.uiService.showToast('You must login to continue')
    }
    if (!roleMatch) {
      this.uiService.showToast('You do not have the permissions to view this resource')
    }
  }
  getResolvedUrl(route?: ActivatedRouteSnapshot): string {
    if (!route) {
      return ''
    }
    return route.pathFromRoot
      .map((r) => r.url.map((segment) => segment.toString()).join('/'))
      .join('/')
      .replace('//', '/')
  }
}
