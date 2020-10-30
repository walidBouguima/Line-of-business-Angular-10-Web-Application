import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manager',
  template: `
  <mat-toolbar color="accent">
    <a mat-button
    routerLink="/manager/home"
    routerLinkActivate="active-link">
    Manager's Dashboard
    </a>
    <a mat-button
    routerLink="/manager/users"
    routerLinkActivate="active-link">
    User Management
    </a>
    <a mat-button
    routerLink="/manager/receipts"
    routerLinkActivate="active-link">
    Receipt Lookup
    </a>

  </mat-toolbar>
  `,
  styles: [
    `
    div[fxLayout]{
      margin-top: 32px;
    }
    `,
    `
    .active-link {
      font-weight: bold;
      border-bottom: 2px solid #005005;
    }
    `
  ]
})
export class ManagerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
