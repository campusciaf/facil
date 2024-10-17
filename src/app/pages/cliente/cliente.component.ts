import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConectarApiService } from '../../servicios/conectar-api.service';
import Swal from 'sweetalert2';

import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from "primeng/button";
import { TableModule } from 'primeng/table';
import { NgFor, NgIf } from '@angular/common';
import { GoogleMapsModule, MapMarker } from '@angular/google-maps';
import { GoogleMapsLoaderService } from '../../servicios/google-maps-loader.service';


@Component({
    selector: 'app-cliente',
    standalone: true,
    templateUrl: './cliente.component.html',
    styleUrl: './cliente.component.css',
    imports: [NgFor, NgIf, MenuComponent,ReactiveFormsModule, FormsModule, TableModule, IconFieldModule, InputIconModule, InputTextModule, ButtonModule,GoogleMapsModule,]
})
export class ClienteComponent implements OnInit{
  mostrar=false;
  
  ideditarmapa:any;// contiene el id del cliente para actualziar la longitud y la latitud
  miLatitud:any;
  miLongitud:any;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private conectarApiService:ConectarApiService,
    private mapsLoader: GoogleMapsLoaderService
  ){

    this.formclientes = this.formBuilder.group({
      cliente_nombre: ['', [Validators.required, Validators.minLength(8)]],
      cliente_identificacion: ["",],
      cliente_celular: ["",],
      cliente_email: ["",],
      cliente_direccion: ["",],
      cliente_estado: ["", Validators.required],
    });

    this.formClientesEditar = this.formBuilder.group({
      id_cliente_e: ["",],
      cliente_identificacion_e: ["",],
      cliente_nombre_e: ['', [Validators.required, Validators.minLength(8)]],
      cliente_municipio_e: ["",],
      cliente_direccion_e: ["",],
      cliente_barrio_e: ["",],
      cliente_celular_e: ["",],
      cliente_email_e: ["",],
      cliente_estado_e: ["", Validators.required],
    });

  

  }

  /* *********  inicio del mapa de google *********** */

  // center: google.maps.LatLngLiteral = { lat: 4.8362844, lng: -75.700551 };
  // zoom = 14;
  // markerPosition: google.maps.LatLngLiteral = this.center;
  // markerOptions: google.maps.MarkerOptions = { draggable: true };

  center!: google.maps.LatLngLiteral;
  zoom!: number;
  markerPosition!: google.maps.LatLngLiteral;
  markerOptions!: google.maps.MarkerOptions;
  
/* *************************** */


  ngOnInit() :void {

    this.cargarClientes();

    this.initializeMap();
    this.mapsLoader.load().then(() => {
     
    }).catch(err => {
      console.error(err);
    });

  }

  cargarClientes(){
    this.conectarApiService.listarCliente().subscribe((data: any) => {
      this.listaClientes=data;
      this.loading = false;
    });
  }

  formclientes:FormGroup;

    //  abrir el modal para agregar cliente 
    content: any;
    open(content: any) {
      this.modalService.open(content, { centered: true });
    }
  // *************************************

  listaClientes: any;
  loading: boolean = true;
  resultado:any;

  registro() {

    if (this.formclientes.valid){

      const cliente = { //Todos los datos son válidos
        cliente_nombre: this.formclientes.value.cliente_nombre, 
        cliente_identificacion: this.formclientes.value.cliente_identificacion, 
        cliente_celular: this.formclientes.value.cliente_celular,
        cliente_email: this.formclientes.value.cliente_email,
        cliente_direccion: this.formclientes.value.cliente_direccion,
        cliente_estado: this.formclientes.value.cliente_estado,
        token: localStorage.getItem('token'),
        iduser: localStorage.getItem('idnum'),
      };

      this.conectarApiService.registrarCliente(cliente ).subscribe((data: { status: string; }) => {
        if(data.status == "ok"){
          this.modalService.dismissAll();// codigo para cerrar el modal
          this.formclientes.reset();
          this.cargarClientes();
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Cliente creado" ,
            showConfirmButton: false,
            timer: 2500
          });

        }else{
          Swal.fire({
            position: "top-end",
            icon: "warning",
            title: "no se pudo crear el cliente" ,
            showConfirmButton: false,
            timer: 2500
          });
        }
      });
    }
      
    else{//Hay datos inválidos en el formulario
      Swal.fire({
        title: "alerta!",
        text: "No cumple con los parametros!",
        icon: "warning"
      });
    }
      




  }

  //  abrir el modal para editar proveedor 
  datosEditarCliente:any;
  formClientesEditar: FormGroup = this.formBuilder.group({});
  content2: any;

  open2(content2: any , id:any) {
    this.modalService.open(content2, { centered: true });

    this.conectarApiService.clienteEditar(id).subscribe((data) => {
      this.datosEditarCliente=data;
      this.formClientesEditar = new FormGroup({
        'id_cliente_e': new FormControl(id),
        'cliente_identificacion_e': new FormControl(this.datosEditarCliente[0]["cliente_identificacion"]),
        'cliente_nombre_e': new FormControl(this.datosEditarCliente[0]["cliente_nombre"]),
        'cliente_municipio_e': new FormControl(this.datosEditarCliente[0]["cliente_municipio"]),
        'cliente_direccion_e': new FormControl(this.datosEditarCliente[0]["cliente_direccion"]),
        'cliente_barrio_e': new FormControl(this.datosEditarCliente[0]["cliente_barrio"]),
        'cliente_celular_e': new FormControl(this.datosEditarCliente[0]["cliente_celular"]),
        'cliente_email_e': new FormControl(this.datosEditarCliente[0]["cliente_email"]),
        'cliente_estado_e': new FormControl(this.datosEditarCliente[0]["cliente_estado"]),
        'token':new FormControl(localStorage.getItem('token')),
      });

  
    });
    
  }

  editar(){
    const datos = { 
      accion:'editar', 
      id_cliente_e: this.formClientesEditar.value.id_cliente_e,
      cliente_identificacion_e: this.formClientesEditar.value.cliente_identificacion_e, 
      cliente_nombre_e: this.formClientesEditar.value.cliente_nombre_e,
      cliente_municipio_e: this.formClientesEditar.value.cliente_municipio_e ,
      cliente_direccion_e: this.formClientesEditar.value.cliente_direccion_e,
      cliente_barrio_e: this.formClientesEditar.value.cliente_barrio_e ,
      cliente_celular_e: this.formClientesEditar.value.cliente_celular_e ,
      cliente_email_e: this.formClientesEditar.value.cliente_email_e ,
      cliente_estado_e: this.formClientesEditar.value.cliente_estado_e ,
      token: localStorage.getItem('token'),
    };
 
      this.conectarApiService.editarCliente(datos).subscribe((data: { status: string; }) => {
        if(data.status == "ok"){
          this.modalService.dismissAll();// codigo para cerrar el modal
          this.formclientes.reset();
          this.cargarClientes();
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
            title: "no se pudo editar el cliente" ,
            showConfirmButton: false,
            timer: 2500
          });
        }
    });
    
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.listaClientes);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array"
      });
      this.saveAsExcelFile(excelBuffer, "clientes");
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

  open3(content3: any , id:any) {
  
    this.modalService.open(content3, { centered: true, size: 'xl' },);
    this.ideditarmapa=id;

    this.conectarApiService.traerUbicacion(id).subscribe((data:any) => {
      console.log(data);
      if(data[0]["cliente_latitud"] == null || data[0]["cliente_longitud"] == null){
        this.miLatitud=4.8362844;
        this.miLongitud=-75.700551;
        this.initializeMap()
      }
      else{
        this.miLatitud=data[0]["cliente_latitud"];
        this.miLongitud=data[0]["cliente_longitud"];
        this.initializeMap()
      }
      
    });
  }
  
  markerDragEnd(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.miLatitud= this.markerPosition.lat;
      this.miLongitud = this.markerPosition.lng;
    }
  }
  
  mapClicked(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
    }
  }

  initializeMap() {


    this.center = { lat: Number(this.miLatitud), lng: Number(this.miLongitud)};
    this.zoom = 14;
    this.markerPosition = this.center;
    this.markerOptions = { draggable: true };
  }
  
  
    /** **************** * */

guardarUbicacion(){
  const datos = {
    accion:'ubicacion', 
    id_cliente: this.ideditarmapa,
    cliente_latitud: this.miLatitud, 
    cliente_longitud: this.miLongitud,
    token: localStorage.getItem('token'),
  };
  this.conectarApiService.editarCliente(datos).subscribe((data: { status: string; }) => {
    if(data.status == "ok"){
      this.modalService.dismissAll();// codigo para cerrar el modal
      this.cargarClientes();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Ubicación guardada" ,
        showConfirmButton: false,
        timer: 2500
      });

    }else{
      Swal.fire({
        position: "top-end",
        icon: "warning",
        title: "NO se pudo guardar la ubicación" ,
        showConfirmButton: false,
        timer: 2500
      });
    }
});

}

  account_validation_messages = {
    'cliente_nombre': [
      { type: 'required', message: 'Campo nombre del cliente requerido' },
      { type: 'minlength', message: 'Su nombre debe tener al menos 8 caracteres' },
      { type: 'maxlength', message: 'Su nombre no puede tener más de 33 caracteres' },
      { type: 'pattern', message: 'Su nombre debe contener solo letras' },
      { type: 'validUsername', message: 'Your username has already been taken' }
    ],
    'correo': [
      { type: 'required', message: 'campo de correo requerido' },
      { type: 'email', message: 'Ingresar un correo valido' }
    ],
    'celular': [
      { type: 'required', message: 'Campo de nombre requerido' },
      { type: 'minlength', message: 'El numero debe terner 10 caracteres' },
      { type: 'maxlength', message: 'El numero debe terner 10 caracteres' },
      { type: 'pattern', message: 'solo debe contener numeros' }

    ],
    'nombre_acudiente': [
      { type: 'required', message: 'Campo de nombre requerido' },
      { type: 'minlength', message: 'Su nombre debe tener al menos 6 caracteres' },
      { type: 'maxlength', message: 'Su nombre no puede tener más de 33 caracteres' },
      { type: 'pattern', message: 'Su nombre debe contener solo letras' },
      { type: 'validUsername', message: 'Your username has already been taken' }

    ],
    'celular_acudiente': [
      { type: 'required', message: 'Campo de nombre requerido' },
      { type: 'minlength', message: 'El numero debe terner 10 caracteres' },
      { type: 'maxlength', message: 'El numero debe terner 10 caracteres' },
      { type: 'pattern', message: 'solo debe contener numeros' }

    ],
    
    'confirm_password': [
      { type: 'required', message: 'Confirm password is required' },
      { type: 'areEqual', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 5 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number' }
    ],
    'terms': [
      
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
  }






}
