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
    selector: 'app-entregas-detalle',
    standalone: true,
    templateUrl: './entregas-detalle.component.html',
    styleUrl: './entregas-detalle.component.css',
    imports: [NgFor, NgIf, MenuComponent,TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule,RouterLink],
})
export class EntregasDetalleComponent {

  constructor(
    private conectarApiService:ConectarApiService,
    private  _route:ActivatedRoute,
    ) {

    }
  detallePedido:any;
  nombreCliente:any;
  mostrar=false;
  loading: boolean = true;

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.detallePedido);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "Venta");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
      let EXCEL_EXTENSION = ".xlsx";
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(
        data,
        fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

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

  estadoEntrega(){
    var id:number = +this._route.snapshot.paramMap.getAll('id');
    Swal.fire({
      title: "Estas seguro?",
      text: "Quiere cambiar el estado de la entrega!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, cambiar!"
    }).then((result) => {
      if (result.isConfirmed) {

        this.conectarApiService.cambiarEstadoEntrega(id).subscribe(respuesta=>{
          Swal.fire({
            title: "Correcto!",
            text: "La entrega cambio de estado.",
            icon: "success"
          });
          this.ngOnInit();
        }); 
       
      }
    });
    

  }


}
