import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { ConectarApiService } from '../../servicios/conectar-api.service';
import { NgFor, NgIf } from '@angular/common';


import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from "primeng/button";
import { RouterLink } from '@angular/router';



@Component({
    selector: 'app-pedidos',
    standalone: true,
    templateUrl: './pedidos.component.html',
    styleUrl: './pedidos.component.css',
    imports: [NgFor, NgIf, MenuComponent,TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule,RouterLink],
})
export class PedidosComponent {

  constructor(
    private conectarApiService:ConectarApiService,
  ){

  }


  listar: any;
  loading: boolean = true;

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.listar);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "proveedores");
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

  ngOnInit() :void {
    this.listarVentas();
  }

  listarVentas(){
    this.conectarApiService.listarVenta().subscribe((data: any) => {
      this.listar=data;
      this.loading = false;
    });
  }

}
