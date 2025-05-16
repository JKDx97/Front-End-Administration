import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { LaptopsComponent } from './laptops/laptops.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { ConsolasComponent } from './consolas/consolas.component';
import { PcsComponent } from './pcs/pcs.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { StockConsolasComponent } from './stock-consolas/stock-consolas.component';
import { StockLaptopComponent } from './stock-laptop/stock-laptop.component';
import { StockPcsComponent } from './stock-pcs/stock-pcs.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { VentaComponent } from './venta/venta.component';

export const routes: Routes = [
    {path : 'login' , component:LoginComponent},
    {path : '' , component:IndexComponent,canActivate : [authGuard]},
    {path : 'laptops' , component:LaptopsComponent,canActivate : [authGuard]},
    {path : 'consolas' , component:ConsolasComponent, canActivate : [authGuard]},
    {path : 'pcs' , component:PcsComponent , canActivate : [authGuard]},
    {path : 'proveedores' , component:ProveedoresComponent , canActivate : [authGuard]},
    {path : 'stock_consolas' , component: StockConsolasComponent, canActivate : [authGuard]},
    {path : 'stock_laptops' , component : StockLaptopComponent , canActivate : [authGuard]},
    {path : 'stock_pcs' , component: StockPcsComponent , canActivate : [authGuard]},
    {path : 'pedidos' , component:PedidosComponent, canActivate : [authGuard]},
    {path: 'venta/:dni', component: VentaComponent, canActivate: [authGuard] }
];
