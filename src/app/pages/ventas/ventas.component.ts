import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { ConectarApiService } from '../../servicios/conectar-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [MenuComponent,DecimalPipe,NgFor, NgIf, TableModule,ButtonModule,InputTextModule,InputNumberModule,DropdownModule],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent {

  constructor(
      private conectarApiService:ConectarApiService,
      private modalService: NgbModal,
  ){
  
  }
      id_user=localStorage.getItem('idnum');
      token=localStorage.getItem('token');
  
      loading: boolean = true;
      validarUsuario:any;
      id_venta:any;
      listaventa:any;
      subtotal:any
      listaclientes:any;

      clienteactivo:any;
  
      ngOnInit() :void {
          this.verificarVenta();
          
      }
      verificar:any;
        
      verificarVenta(){
        
        this.conectarApiService.verificarVenta(this.id_user).subscribe((data: any) => {// verificar si tiene una compra activa
          this.verificar=data.length;
          if(this.verificar==1){
            this.id_venta=data[0].id_venta;
            let id_cliente=data[0].id_cliente;

            this.conectarApiService.traerVenta(this.id_venta).subscribe((dataventa: any) => {
                this.listaventa=dataventa;
                let subtotal = 0;
                for(let a=0;a<dataventa.length;a++){
                  subtotal += dataventa[a].venta_productos_subtotal; 
                }
                this.subtotal=subtotal
                
            });

            this.conectarApiService.listarCliente().subscribe((datacliente: any) => {
              this.listaclientes=datacliente;
              this.clienteactivo=id_cliente
            });

          }
            
          
        });
      }
  
      //  abrir el modal para ver los productos y poder comprar
      listarProductos:any;
      content: any;
      open(content: any) {
        this.modalService.open(content, { centered: true, size: 'xl' },);
        this.listarProductosDisponibles();
      }

    // *************************************
    listarProductosDisponibles(){
      this.conectarApiService.listarProductosDisponiblesVentas().subscribe((listadeproductos: any) => {
        this.listarProductos=listadeproductos;
        this.loading = false;
      });
    }
  
    nuevaVenta(){// ingeresar una nueva compra
      Swal.fire({
          title: "Nueva factura de venta?",
          text: "estas seguro de generar una nueva venta!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "si, quiero vender!",
          cancelButtonText: "cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
  
          var id_user=localStorage.getItem('idnum');
              this.conectarApiService.facturaVenta(id_user).subscribe((data: any) => {
              this.verificarVenta();
          });
  
            Swal.fire({
              title: "Factura creada!",
              text: "Puedes realizar ventas.",
              icon: "success"
            });
  
          }
        });
    }
    resultadoDatosProductoDisponibles:any
    agregar(codigo: any){

       const datoscompra = { 
        id_venta: this.id_venta, 
        id_producto: codigo,
        venta_productos_cantidad:Number((<HTMLInputElement>document.getElementById("cantidad"+codigo)).value),
        venta_productos_precio:Number((<HTMLInputElement>document.getElementById("precio"+codigo)).value),
        venta_productos_usuario:localStorage.getItem('idnum'),
      };

      this.conectarApiService.obtenerProductoEditar(codigo).subscribe((datosProductoDisponibles:any) => {
        this.resultadoDatosProductoDisponibles=datosProductoDisponibles;
        if(this.resultadoDatosProductoDisponibles[0].producto_disponibles<datoscompra.venta_productos_cantidad){
            Swal.fire({
              position: "top-end",
              icon: "warning",
              title: "Cantidad superada",
              showConfirmButton: false,
              timer: 1500
            });
        }else{
          this.conectarApiService.addVenta(datoscompra).subscribe((resultado: { status: string; }) => {
        
            if(resultado.status="ok"){
      
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Producto agregado",
                showConfirmButton: false,
                timer: 1500
              });
              this.modalService.dismissAll();// codigo para cerrar el modal
              this.verificarVenta();
              this.listarProductosDisponibles();
            }
      
          });
        }
      });

  

     
  
    }
  
    datosUsuario:any; 
    
    quitar(id: any){
  
      Swal.fire({
        title: "Eliminar producto?",
        text: "Realmente deseas elimiar el producto de la venta!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "cancelar!"
      }).then((result) => {
        if (result.isConfirmed) {
  
          let datos=JSON.stringify({
            "token" : localStorage.getItem("token"),
            "id_del" : id,
          });
  
          this.conectarApiService.delProductoVenta(datos).subscribe((data) => {
            this.datosUsuario=data;
              if(data.status == "ok"){
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Producto eliminado",
                  showConfirmButton: false,
                  timer: 1500
                });
                this.verificarVenta();
              }
          });
  
        }
      });
  
  
    }
  
    terminar(id_venta:any){
  
      Swal.fire({
        title: "Estas seguro?",
        text: "Quieres terminar esta venta!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, terminar!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {
  
          this.conectarApiService.traerVenta(id_venta).subscribe((resultadoVenta: any) => {
            let venta_neto_venta=0;
            for(let b=0;b<resultadoVenta.length;b++){
              venta_neto_venta=venta_neto_venta+resultadoVenta[b].venta_productos_subtotal;
            }
            
              let id_cliente=Number((<HTMLInputElement>document.getElementById("cliente")).value);
              const datoscerrar = { 
                id_venta: this.id_venta, 
                id_cliente: id_cliente,
                venta_neto_suma: venta_neto_venta,
                venta_iva:0,
                venta_total_iva:0,
                venta_total:venta_neto_venta,
                id_user:localStorage.getItem('idnum'),
                token:localStorage.getItem('token'),
              };

              if(id_cliente==0){
                Swal.fire({
                  title: "OPPS!",
                  text: "Falta seleccionar cliente para esta venta.",
                  icon: "warning"
                });
              }else{

 
                this.conectarApiService.terminarVenta(datoscerrar).subscribe((resultadoTerminar: any) => {
                
                  if(resultadoTerminar.status == "ok"){
                    Swal.fire({
                      title: "Muy bien!",
                      text: "Venta finalizada con éxito.",
                      icon: "success"
                    });
                    this.verificarVenta();
                  }
                 
                });

              }
  
          });

        }
      });
  
      
    }
  }
