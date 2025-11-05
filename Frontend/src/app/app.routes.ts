import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/components/layout/layout.component';
import { NotfoundComponent } from './pages/components/notfound/notfound.component';
import { CategoryComponent } from './pages/components/category/category.component';
import { ProductComponent } from './pages/components/product/product.component';
import { CategoryImportComponent } from './pages/components/imports/category-import/category-import.component';
import { authGuard } from './pages/components/auth/guards/auth.guard';

export const routes: Routes = [
    {   path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    {
        path : 'product-management',
        component : LayoutComponent,
         canActivate: [authGuard],
        children : [
            {  path : '', component : CategoryComponent },
            {  path : 'products', component : ProductComponent },
            {  path : 'import/category', component : CategoryImportComponent },
                 
        ]
    },
    {   path : 'notfound', component : NotfoundComponent, },
    {   path : 'auth', loadChildren : () => import('./pages/components/auth/auth.routes') },
    {   path: '**', redirectTo: '/notfound'}

];
