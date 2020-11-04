import { Component } from '@angular/core'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

import { AuthService } from './auth/auth.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public authService: AuthService
  ) {
    iconRegistry.addSvgIcon(
      'lime',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/lime.svg')
    )
  }
}
