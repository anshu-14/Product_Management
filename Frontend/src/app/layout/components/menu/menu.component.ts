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
                { label: 'Dashboard', icon: 'pi pi-fw pi-sliders-h', routerLink: ['/certify-iq'] }
            ]
        },
        {
            label: 'UI Components',
            items: [
                { label: 'User Exams', icon: 'pi pi-fw pi-id-card', routerLink: ['/certify-iq/user-exams'] },
                { label: 'Courses', icon: 'pi pi-fw pi-check-square', routerLink: ['/certify-iq/courses'] },
                { label: 'Lectures', icon: 'pi pi-fw pi-mobile', class: 'rotated-icon', routerLink: ['/certify-iq/lectures'] },
                { label: 'Update Profiles', icon: 'pi pi-fw pi-table', routerLink: ['/certify-iq/profile'] },
                { label: 'About', icon: 'pi pi-fw pi-list', routerLink: ['/certify-iq/about'] },
                { label: 'Contact Us', icon: 'pi pi-fw pi-share-alt', routerLink: ['/certify-iq/contact'] },
            ]
        }
    ];
    }
}
