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
import { NgxPrintModule } from 'ngx-print';

@Component({
    selector: 'app-compras',
    standalone: true,
    templateUrl: './compras.component.html',
    styleUrl: './compras.component.css',
    imports: [MenuComponent,DecimalPipe,NgFor, NgIf, TableModule,ButtonModule,InputTextModule,InputNumberModule,NgxPrintModule]
})
export class ComprasComponent {

constructor(
    private conectarApiService:ConectarApiService,
    private modalService: NgbModal,
){

}
    id_user=localStorage.getItem('idnum');
    token=localStorage.getItem('token');

    loading: boolean = true;
    validarUsuario:any;
    id_compra:any;
    listacompra:any;
    subtotal:any
    listaproveedores:any;

    proveedoractivo:any;
    ngOnInit() :void {
        this.verificarCompra();
        
    }
    verificar:any;
        
    verificarCompra(){
      
      this.conectarApiService.verificarCompra(this.id_user).subscribe((data: any) => {// verificar si tiene una compra activa
        this.verificar=data.length;
        if(this.verificar==1){// si la compra esta activa muestra los datos de la compra
          this.id_compra=data[0].id_compra;
          let id_proveedor=data[0].id_proveedor;
          

          this.conectarApiService.traerCompra(this.id_compra).subscribe((datacompra: any) => {
              this.listacompra=datacompra;
              let subtotal = 0;
              for(let a=0;a<datacompra.length;a++){
                subtotal += datacompra[a].compra_productos_subtotal;
              }
              this.subtotal=subtotal
              
          });

          this.conectarApiService.proveedores().subscribe((dataproveedor: any) => {
            this.listaproveedores=dataproveedor;
            this.proveedoractivo=id_proveedor
          });
          
        }
        
      });
    }

    //  abrir el modal para ver los productos y poder comprar
    listarProductos:any;
    content: any;
    open(content: any) {
      this.modalService.open(content, { centered: true, size: 'xl' },);

      this.conectarApiService.listarProductosDisponibles().subscribe((listadeproductos: any) => {
        this.listarProductos=listadeproductos;
        this.loading = false;
      });

    }
    // *************************************

    nuevaCompra(){// ingeresar una nueva compra
      Swal.fire({
          title: "Nueva factura de compra?",
          text: "estas seguro de generar una nueva compra!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "si, quiero comprar!",
          cancelButtonText: "cancelar"
        }).then((result) => {
          if (result.isConfirmed) {

          var id_user=localStorage.getItem('idnum');
              this.conectarApiService.facturaCompra(id_user).subscribe((data: any) => {
              this.verificarCompra();
          });

            Swal.fire({
              title: "Factura creada!",
              text: "Puedes realizar compras.",
              icon: "success"
            });

          }
        });
    }

    agregar(codigo: any){

    
      const datoscompra = { 
        id_compra: this.id_compra, 
        id_producto: codigo,
        compra_productos_cantidad:Number((<HTMLInputElement>document.getElementById("cantidad"+codigo)).value),
        compra_productos_precio:Number((<HTMLInputElement>document.getElementById("precio"+codigo)).value),
        compra_productos_id_usuario:localStorage.getItem('idnum'),
      };

      this.conectarApiService.addCompra(datoscompra).subscribe((resultado: { status: string; }) => {
        if(resultado.status="ok"){

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto agregado",
            showConfirmButton: false,
            timer: 1500
          });
          this.modalService.dismissAll();// codigo para cerrar el modal
          this.verificarCompra()
        }

      });

    }

    datosUsuario:any; 
    
    quitar(id: any){

      Swal.fire({
        title: "Eliminar producto?",
        text: "Realmente deseas elimiar el producto de la compra!",
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

          this.conectarApiService.delProductoCompra(datos).subscribe((data) => {
            this.datosUsuario=data;
              if(data.status == "ok"){
                Swal.fire({
                  position: "top-end",
                  icon: "success",
                  title: "Producto eliminado",
                  showConfirmButton: false,
                  timer: 1500
                });
                this.verificarCompra();
              }
          });

        }
      });


    }

    terminar(id_compra:any){

      Swal.fire({
        title: "Estas seguro?",
        text: "Quieres terminar esta compra!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, terminar!",
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.isConfirmed) {

          this.conectarApiService.traerCompra(id_compra).subscribe((resultadoCompra: any) => {
            let compra_neto_suma=0;
            for(let b=0;b<resultadoCompra.length;b++){
              compra_neto_suma=compra_neto_suma+resultadoCompra[b].compra_productos_subtotal;
            }

            let id_proveedor=Number((<HTMLInputElement>document.getElementById("proveedor")).value);
            
              const datoscerrar = { 
                id_compra: this.id_compra, 
                id_proveedor: id_proveedor,
                compra_neto_suma: compra_neto_suma,
                compra_iva:0,
                compra_total_iva:0,
                compra_total:compra_neto_suma,
                id_user:localStorage.getItem('idnum'),
                token:localStorage.getItem('token'),
              };


              if(id_proveedor==0){
                Swal.fire({
                  title: "OPPS!",
                  text: "Falta seleccionar proveedor para esta compra.",
                  icon: "warning"
                });
              }else{

                this.conectarApiService.terminarCompra(datoscerrar).subscribe((resultadoTerminar: any) => {
                  if(resultadoTerminar.status == "ok"){
                    Swal.fire({
                      title: "Muy bien!",
                      text: "Compra finalizada con éxito.",
                      icon: "success"
                    });
                    this.verificarCompra();
                  }
                
                });

              }


              

          });


        }
      });

      
    }

    printDiv() {
      // Obtén el contenido del div por su ID
      const printContents = document.getElementById('printableDiv')?.innerHTML;
  
      if (printContents) {
        // Abre una nueva ventana para el contenido de impresión
        const popupWindow = window.open('', '_blank', 'width=600,height=400');
        if (popupWindow) {
          popupWindow.document.open();
          popupWindow.document.write(`
            <html>
              <head>
                <title>Imprimir contenido</title>
                <style>
                  /* Agrega aquí los estilos necesarios para tu impresión */
                  body { font-family: Arial, sans-serif; }
                  .bg-3 { background-color: #f3f3f3; }
                </style>
              </head>
              <body onload="window.print();window.close()">
                ${printContents}
              </body>
            </html>
          `);
          popupWindow.document.close();
        }
      }
    }
    
}
