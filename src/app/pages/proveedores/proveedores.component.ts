import { Component, OnInit } from '@angular/core';
import { ConectarApiService } from '../../servicios/conectar-api.service';
import { NgFor, NgIf } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from "primeng/button";
import { MenuComponent } from "../menu/menu.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { response } from 'express';
import { RouterLink } from '@angular/router';



@Component({
    selector: 'app-proveedores',
    standalone: true,
    templateUrl: './proveedores.component.html',
    styleUrl: './proveedores.component.css',
    imports: [NgFor, NgIf, FormsModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule, MenuComponent,ReactiveFormsModule,RouterLink]

  })
export class ProveedoresComponent implements OnInit{
  
mostrar=false;

  constructor(
    private conectarApiService:ConectarApiService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer
  ){
    this.formproveedores = this.formBuilder.group({
      proveedor_nombre: ['', [Validators.required, Validators.email]],
      proveedor_imagen: ["", Validators.required],
      proveedor_estado: ["", Validators.required]
    });


    this.formProveedoresEditar = this.formBuilder.group({
      id_proveedor_e: ['', [Validators.required]],
      proveedor_nombre_e: ['', [Validators.required, Validators.minLength(2)]],
      proveedor_imagen_e: [''],
      proveedor_estado_e: ['', [Validators.required, ]],
    
    });
    
  }
  
  listaProveedores: any;
  loading: boolean = true;

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.listaProveedores);
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
    this.cargarProveedores();
  }

  cargarProveedores(){
    this.conectarApiService.proveedores().subscribe((data: any) => {
      this.listaProveedores=data;
      this.loading = false;
    });
  }

  //  abrir el modal para agregar proveedor 
    content: any;
    open(content: any) {
      this.modalService.open(content, { centered: true });
    }
  // *************************************


  formproveedores:FormGroup;
  registro() {
    const user = { 
      proveedor_nombre: this.formproveedores.value.proveedor_nombre, 
      // proveedor_imagen: this.archivos[0]["name"],
      proveedor_imagen: this.previsualizacion,
      proveedor_estado: this.formproveedores.value.proveedor_estado ,
      
    };

    this.conectarApiService.proveedor(user).subscribe((data: { status: string; }) => {
      if(data.status == "ok"){
        this.modalService.dismissAll();// codigo para cerrar el modal
        this.formproveedores.reset();
        this.cargarProveedores();
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Registro correcto" ,
          showConfirmButton: false,
          timer: 2500
        });

      }else{
        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: "no se pudo crear" ,
          showConfirmButton: false,
          timer: 2500
        });
      }
    });
  }

  // codigo para mostrar la imagen en miniatura
  public archivos: any =[];
  public previsualizacion: string | undefined;
  
  seleccionarArchivo(event: any){
    const archivoCapturado = event.target.files[0];
    
    this.extraerBase64(archivoCapturado).then((imagen: any)=>{
      this.previsualizacion= imagen;
    })
    this.archivos.push(archivoCapturado);
  }

  extraerBase64 =  async function encodeFileAsBase64URL($event: Blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('loadend', () => {
            resolve(reader.result);
        });
        reader.readAsDataURL($event);
    });
  };

// **************************


//  abrir el modal para editar proveedor 
datosEditarProveedor:any;
formProveedoresEditar: FormGroup = this.formBuilder.group({});
content2: any;

  open2(content2: any , id:any) {
    this.modalService.open(content2, { centered: true });

    this.conectarApiService.usuariosEditar(id).subscribe((data) => {
      this.datosEditarProveedor=data;
      this.previsualizacion=this.datosEditarProveedor[0]["proveedor_imagen"];

      this.formProveedoresEditar = new FormGroup({
        'id_proveedor_e': new FormControl(this.datosEditarProveedor[0]["id_proveedor"]),
        'proveedor_nombre_e': new FormControl(this.datosEditarProveedor[0]["proveedor_nombre"]),
        'proveedor_imagen_e': new FormControl(this.datosEditarProveedor[0]["proveedor_imagen"]),
        'proveedor_estado_e': new FormControl(this.datosEditarProveedor[0]["proveedor_estado"]),
        'token':new FormControl(localStorage.getItem('token')),
      });

      this.formProveedoresEditar.get('proveedor_imagen_e')?.setValue('');
    });
    
  }

  editar(){
    const datos = { 
      id_proveedor_e: this.formProveedoresEditar.value.id_proveedor_e,
      proveedor_nombre_e: this.formProveedoresEditar.value.proveedor_nombre_e, 
      proveedor_imagen_e: this.previsualizacion,
      proveedor_estado_e: this.formProveedoresEditar.value.proveedor_estado_e ,
      token: localStorage.getItem('token'),
    };
 
      this.conectarApiService.editarProveedor(datos).subscribe((data: { status: string; }) => {
        if(data.status == "ok"){
          this.modalService.dismissAll();// codigo para cerrar el modal
          this.formproveedores.reset();
          this.cargarProveedores();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Edicion correcto" ,
            showConfirmButton: false,
            timer: 2500
          });
    
        }else{
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "no se pudo editar" ,
            showConfirmButton: false,
            timer: 2500
          });
        }
    });
    
  }


// *************************************




}


