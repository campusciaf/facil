
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LoginGuard } from './guards/login.guards';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ProveedorAddComponent } from './pages/proveedor-add/proveedor-add.component';
import { ComprasComponent } from './pages/compras/compras.component';
import { VentasComponent } from './pages/ventas/ventas.component';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { PedidosDetalleComponent } from './pages/pedidos-detalle/pedidos-detalle.component';
import { EntregasComponent } from './pages/entregas/entregas.component';
import { EntregasDetalleComponent } from './pages/entregas-detalle/entregas-detalle.component';
import { ProductosComponent } from './pages/productos/productos.component';


export const routes: Routes = [

    {path: '', redirectTo:'login' , pathMatch:'full'},
    {path: 'login', component:LoginComponent},
    {path: 'proveedores', component:ProveedoresComponent,canActivate:[LoginGuard]},
    {path: 'proveedoradd/:id', component:ProveedorAddComponent,canActivate:[LoginGuard]},
    {path: 'dashboard', component:DashboardComponent,canActivate:[LoginGuard]},
    {path: 'compras', component:ComprasComponent,canActivate:[LoginGuard]},
    {path: 'ventas', component:VentasComponent,canActivate:[LoginGuard]},
    {path: 'cliente', component:ClienteComponent,canActivate:[LoginGuard]},
    {path: 'productos', component:ProductosComponent,canActivate:[LoginGuard]},
    {path: 'pedidos', component:PedidosComponent,canActivate:[LoginGuard]},
    {path: 'pedidosdetalle/:id', component:PedidosDetalleComponent,canActivate:[LoginGuard]},
    {path: 'entregas', component:EntregasComponent,canActivate:[LoginGuard]},
    {path: 'entregasdetalle/:id', component:EntregasDetalleComponent,canActivate:[LoginGuard]},
    
];
