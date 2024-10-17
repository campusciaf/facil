import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { ConectarApiService } from '../../servicios/conectar-api.service';
import { NgFor, NgIf } from '@angular/common';


import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from "primeng/button";
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-pedidos-detalle',
    standalone: true,
    templateUrl: './pedidos-detalle.component.html',
    styleUrl: './pedidos-detalle.component.css',
    imports: [NgFor, NgIf, MenuComponent,TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule,RouterLink],
})
export class PedidosDetalleComponent {

  constructor(
    private conectarApiService:ConectarApiService,
    private  _route:ActivatedRoute,
    ) {

    }
  detallePedido:any;
  nombreCliente:any;
  mostrar=false;
  loading: boolean = true;

  ngOnInit(): void {

    var id:number = +this._route.snapshot.paramMap.getAll('id');
    /* consulta para traer los productos del proveedor */
    this.conectarApiService.listarVentaDetalle(id).subscribe(respuesta=>{
      this.detallePedido=respuesta
      this.loading = false;
    }); 

/* consulta para traer los datos del provewedor */
    this.conectarApiService.clienteEditar(id).subscribe(respuesta=>{
      this.nombreCliente=respuesta[0].cliente_nombre;
      
    }); 
    
  }

  estadoAlistado(id_venta_producto:any,estado:any,id_venta:any){
    Swal.fire({
      title: "Estas seguro?",
      text: "Quiere cambiar el estado del producto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cambiar!"
    }).then((result) => {
      if (result.isConfirmed) {

        this.conectarApiService.cambiarEstadoAlistado(id_venta_producto,estado,id_venta).subscribe(respuesta=>{
          Swal.fire({
            title: "Correcto!",
            text: "El producto cambio de estado.",
            icon: "success"
          });
          this.ngOnInit();
        }); 
       
      }
    });
    

  }


}
