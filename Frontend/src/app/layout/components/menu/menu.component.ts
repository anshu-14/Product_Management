import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenuitemsComponent } from '../menuitems/menuitems.component';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, MenuitemsComponent, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class MenuComponent {
    model: MenuItem[] = [];

    ngOnInit() {
      this.model = [
        {
            label: 'Home',
            items: [
                { label: 'Category', icon: 'pi pi-fw pi-sliders-h', routerLink: ['/product-management'] },
                { label: 'Product', icon: 'pi pi-fw pi-id-card', routerLink: ['/product-management/products'] },
            ]
        },
        {
            label: 'Import',
            items: [
                { label: 'Import Category', icon: 'pi pi-fw pi-id-card', routerLink: ['/product-management/import/category'] },
            ]
        }
    ];
    }
}
