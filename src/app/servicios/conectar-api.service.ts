import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConectarApiService {

  API: string='http://localhost/facil-apirest';
  // API: string='https://dulcesymas.ciaf.digital/apirest';
  autorizacion = 'KFTDQFYvqbPLXkHTuXQJR4Qy3vUryK';

  private clienteHttp = inject(HttpClient);
  constructor() { }

  login(datos: any): Observable<any> {
    return this.clienteHttp.post(this.API+ '/login.php', datos);
  }

  datoCuenta(id:any,token: any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/cuenta.php?id='+id+'&token='+token);
  }
  temaActualizar(datos: any): Observable<any>{
    return this.clienteHttp.put(this.API+ '/cuenta.php', datos);
  }

  proveedor(datos: any ): Observable<any> {
    return this.clienteHttp.post(this.API+ '/proveedor.php', datos);
  }

  proveedores(): Observable<any>{
    return this.clienteHttp.get(this.API+ '/proveedor.php?page=1');
  }
  obtenerProveedorId(id:number): Observable<any>{
    const headers = new HttpHeaders({'Autorizacion': this.autorizacion});
    return this.clienteHttp.get(this.API+ '/proveedor.php?id='+id,{headers});
  }

  usuariosEditar(id: number | null): Observable<any>{
    return this.clienteHttp.get(this.API+ '/proveedor.php?id='+id);
  }
  menuNav(id: any, valor:any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/menuNav.php?id='+id+'&valor='+valor);
  }

  editarProveedor(datos:any): Observable<any>{
    return this.clienteHttp.put(this.API+ '/proveedor.php', datos);
  }

  listarProductos(): Observable<any>{
    return this.clienteHttp.get(this.API+ '/producto.php?listar');
  }

  listarProductosDisponibles(): Observable<any>{
    return this.clienteHttp.get(this.API+ '/producto.php?listarDispo');
  }
  listarProductosDisponiblesVentas(): Observable<any>{
    return this.clienteHttp.get(this.API+ '/producto.php?listarDispoVentas');
  }

  producto(datos: any ): Observable<any> {
    return this.clienteHttp.post(this.API+ '/producto.php', datos);
  }

  obtenerProducto(id:number): Observable<any>{
    const headers = new HttpHeaders({'Autorizacion': this.autorizacion});
    return this.clienteHttp.get(this.API+ '/producto.php?id='+id,{headers});
  }
  obtenerProductoEditar(id:number): Observable<any>{
    const headers = new HttpHeaders({'Autorizacion': this.autorizacion});
    return this.clienteHttp.get(this.API+ '/producto.php?edit='+id,{headers});
  }

  editarProducto(datos:any): Observable<any>{
    return this.clienteHttp.put(this.API+ '/producto.php', datos);
  }

  /* consultas para compras y compra productos */

  verificarCompra(id: any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/compra.php?verificar='+id);
  }
  facturaCompra(id: any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/compra.php?crear='+id);
  }
  traerCompra(idcompra: any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/compra.php?traer='+idcompra);
  }

  addCompra(datos: any ): Observable<any> {
    return this.clienteHttp.post(this.API+ '/compra.php', datos);
  }
  delProductoCompra(datos:any): Observable<any>{
    let Options ={
    headers: new HttpHeaders ({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }),
    body:datos
  }
    return this.clienteHttp.delete(this.API+ '/compra',Options);
  }
  terminarCompra(datos:any): Observable<any>{
    return this.clienteHttp.put(this.API+ '/compra.php', datos);
  }
/* ************************************** */

  /* ventas*/

  verificarVenta(id: any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/venta.php?verificar='+id);
  }

  facturaVenta(id: any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/venta.php?crear='+id);
  }
  traerVenta(idventa: any): Observable<any>{
    return this.clienteHttp.get(this.API+ '/venta.php?traer='+idventa);
  }

  addVenta(datos: any ): Observable<any> {
    return this.clienteHttp.post(this.API+ '/venta.php', datos);
  }

  delProductoVenta(datos:any): Observable<any>{
    let Options ={
    headers: new HttpHeaders ({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    }),
    body:datos
  }
  return this.clienteHttp.delete(this.API+ '/venta',Options);
}

terminarVenta(datos:any): Observable<any>{
  return this.clienteHttp.put(this.API+ '/venta.php', datos);
}

listarVenta(): Observable<any>{
  return this.clienteHttp.get(this.API+ '/venta.php?listar');
}
listarEntrega(): Observable<any>{
  return this.clienteHttp.get(this.API+ '/venta.php?listarEntrega');
}
listarVentaDetalle(id:any): Observable<any>{
  return this.clienteHttp.get(this.API+ '/venta.php?listarDetalle='+id);
}

cambiarEstadoAlistado(id:any,estado:any,id_venta:any): Observable<any>{
  return this.clienteHttp.get(this.API+ '/venta.php?estadoAlistado='+id+'&estado='+estado+'&id_venta='+id_venta);
}

cambiarEstadoEntrega(id:any): Observable<any>{
  return this.clienteHttp.get(this.API+ '/venta.php?estadoEntrega='+id);
}


/* ************clientes ***********/


listarCliente(): Observable<any>{
  return this.clienteHttp.get(this.API+ '/cliente.php?listar');
}

traerUbicacion(id: number | null): Observable<any>{
  return this.clienteHttp.get(this.API+ '/cliente.php?traerubicacion='+id);
}
registrarCliente(datos: any ): Observable<any> {
  return this.clienteHttp.post(this.API+ '/cliente.php', datos);
}

clienteEditar(id: number | null): Observable<any>{
  return this.clienteHttp.get(this.API+ '/cliente.php?id='+id);
}

editarCliente(datos:any): Observable<any>{
  return this.clienteHttp.put(this.API+ '/cliente.php', datos);
}

clienteEditarUbicacion(id_cliente: any,cliente_latitud: any,cliente_longitud: any): Observable<any>{
  return this.clienteHttp.get(this.API+ '/cliente.php?clienteubicacion='+id_cliente+'&latitud='+cliente_latitud+'&longitud='+cliente_longitud);
}
/* **************************** */

}
