
import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ConectarApiService } from '../../servicios/conectar-api.service';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from "primeng/button";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


declare var jQuery:any;
declare var $:any;

@Component({
    selector: 'app-productos',
    standalone: true,
    templateUrl: './productos.component.html',
    styleUrl: './productos.component.css',
    imports: [NgFor, NgIf, FormsModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule, MenuComponent,ReactiveFormsModule,RouterLink]
})
export class ProductosComponent {

  constructor(
    private conectarApiService:ConectarApiService,
    private  _route:ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    ) {

      this.formproducto = this.formBuilder.group({
        producto_nombre: ['', [Validators.required, Validators.email]],
        producto_imagen: ["", Validators.required],
        producto_estado: ["", Validators.required]
      });

      this.formProductoEditar = this.formBuilder.group({
        id_producto_e: ['', [Validators.required]],
        producto_nombre_e: ['', [Validators.required, Validators.minLength(2)]],
        producto_imagen_e: [''],
        producto_venta_e: ['', [Validators.required, Validators.minLength(2)]],
        producto_estado_e: ['', [Validators.required, ]],
      
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

  detalleProductos:any;
  detalleProveedor:any;
  mostrar=false;
  loading: boolean = true;

  ngOnInit(): void {

    var id:number = +this._route.snapshot.paramMap.getAll('id');
    /* consulta para traer los productos del proveedor */
    this.conectarApiService.listarProductos().subscribe(respuesta=>{
      this.detalleProductos=respuesta
      this.loading = false;
    }); 

/* consulta para traer los datos del provewedor */
    // this.conectarApiService.obtenerProveedorId(id).subscribe(respuesta=>{
    //   this.detalleProveedor=respuesta[0].proveedor_nombre;
    // }); 
    
  }

  formproducto:FormGroup;
  registro() {
    if(!this.previsualizacion){
      this.previsualizacion="a";
    }
    const user = { 
      producto_id_usuario: localStorage.getItem('idnum'), 
      producto_nombre: this.formproducto.value.producto_nombre, 
      producto_imagen: this.previsualizacion,
      producto_estado: this.formproducto.value.producto_estado ,
      
    };

    this.conectarApiService.producto(user).subscribe((data: { status: string; }) => {
      console.log(data)
      if(data.status == "ok"){
        this.modalService.dismissAll();// codigo para cerrar el modal
        this.formproducto.reset();
        this.ngOnInit();
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

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.detalleProductos);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "productos");
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

  
  //  abrir el modal para agregar proveedor 
  content: any;
  open(content: any) {
    this.modalService.open(content, { centered: true });
  }
// *************************************

  //  abrir el modal para editar proveedor 
  datosEditarProducto:any;
  formProductoEditar: FormGroup = this.formBuilder.group({});
  content2: any;

  open2(content2: any , id:any) {
    this.modalService.open(content2, { centered: true });


    this.conectarApiService.obtenerProductoEditar(id).subscribe((data) => {
      this.datosEditarProducto=data;
      this.previsualizacion=this.datosEditarProducto[0]["producto_imagen"];

      this.formProductoEditar = new FormGroup({
        'id_producto_e': new FormControl(this.datosEditarProducto[0]["id_producto"]),
        'producto_nombre_e': new FormControl(this.datosEditarProducto[0]["producto_nombre"]),
        'producto_imagen_e': new FormControl(this.datosEditarProducto[0]["producto_imagen"]),
        'producto_venta_e': new FormControl(this.datosEditarProducto[0]["producto_venta"]),
        'producto_estado_e': new FormControl(this.datosEditarProducto[0]["producto_estado"]),
        'token':new FormControl(localStorage.getItem('token')),
      });

      this.formProductoEditar.get('producto_imagen_e')?.setValue('');
    });
    
  }
  //  *************************************** // 

  editar(){
    const datos = { 
      id_producto_e: this.formProductoEditar.value.id_producto_e,
      producto_nombre_e: this.formProductoEditar.value.producto_nombre_e, 
      producto_imagen_e: this.previsualizacion,
      producto_venta_e: this.formProductoEditar.value.producto_venta_e ,
      producto_estado_e: this.formProductoEditar.value.producto_estado_e ,
      token: localStorage.getItem('token'),
    };

      this.conectarApiService.editarProducto(datos).subscribe((data: { status: string; }) => {
        if(data.status == "ok"){
          this.modalService.dismissAll();// codigo para cerrar el modal
          this.formProductoEditar.reset();
          this.ngOnInit();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Edicion correcta" ,
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

}
