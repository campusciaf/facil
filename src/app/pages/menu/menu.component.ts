import { NgModule, Component, OnInit, inject } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { NgClass, NgFor, NgIf, } from '@angular/common';
import { ConectarApiService } from '../../servicios/conectar-api.service';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [NgIf, NgClass, NgFor,PanelMenuModule, RouterLink, NgbDropdownModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{

  constructor( 
    private conectarApiService:ConectarApiService){
}
  $consulta: any;
  user_name: any;
  user_state: any;
  usuario_tema: any;

  ngOnInit() : void{
    
    this.menu();
    let idnum=localStorage.getItem('idnum');
    let token=localStorage.getItem('token');

    this.conectarApiService.datoCuenta(idnum,token).subscribe((data) => {
      this.$consulta=data;
      if(data.length==1){
        this.user_name=data[0]['user_name'];
        this.user_state=data[0]['user_state'];
        this.usuario_tema=data[0]['usuario_tema'];
        this.setThema(this.usuario_tema)

      }
      else{
        localStorage.removeItem('token');
        localStorage.removeItem('idnum');
        this.router.navigate(['/login'])
      }
   
    });

  }
  isHighlighted = true;
  status: boolean = false;
  valor=true;

  


  cambioMargen() {
    const screenWidth = window.innerWidth;

    if(screenWidth > 475){

      const element = document.getElementById('content');
      if (element && this.valor==true) {
        element.style.marginLeft = '0px';
        element.classList.add('transition-margin');
        this.valor=false;
      }
     else if (element && this.valor==false){
        element.style.marginLeft = '220px';
        this.valor=true;
      }
      
    }
  }

  clickEvent(){
     
      this.status = !this.status;
      this.cambioMargen();       
  }
  setThema(t: string) {
    document.body.classList.toggle(this.usuario_tema) //para un solo boton
    document.documentElement.className = t;
    let idnum=localStorage.getItem('idnum');

    const datostema = { 
      id: idnum,
      usuario_tema: t, 
      token: localStorage.getItem('token'),
    };

    if(t=="dark"){
      this.isHighlighted = true;
    }else{
      this.isHighlighted = false;
    }

    this.conectarApiService.temaActualizar(datostema).subscribe((dataTema) => {

      if(dataTema.status=="ok"){
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Tema aplicado con éxito",
          showConfirmButton: false,
          timer: 1500
        });
      }
    });

  }

  router = inject(Router)
  logAutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/login'])
  }

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;
 


  $consultaNav: any;
  menu(){
    this.items=[];
    const botones: string | number | any[] = [];

    let idnum=localStorage.getItem('idnum');
    this.conectarApiService.menuNav(idnum,'1').subscribe((data) => {
        this.$consultaNav=data;
        var r = JSON.parse(data);
        for (let i = 0; i < r.length; i++) {
          botones.push(r[i]);
        }

        this.items=botones;
        
        let activar:any;
        if (this.router.url=="/cliente") {
          activar=botones[2].expanded=true
        }
        if (this.router.url=="/productos" || this.router.url=="/proveedores") {
          activar=botones[3].expanded=true
        }
        if (this.router.url=="/compras") {
          activar=botones[4].expanded=true
        }

        if (this.router.url=="/ventas") {
          activar=botones[5].expanded=true
        }

        if (this.router.url=="/pedidos") {
          activar=botones[6].expanded=true
        }

        if (this.router.url=="/entregas") {
          activar=botones[7].expanded=true;
         
        }

        // if (name.includes(' LUPA ')){
        //   console.log("Es verdad");
        // }

       
        
      });

  }




}
