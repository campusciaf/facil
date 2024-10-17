import { Component } from '@angular/core';
import { ConectarApiService } from '../../servicios/conectar-api.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {Router} from '@angular/router';




declare var jQuery:any;
declare var $:any;
declare let alertify: any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  proveedores:FormGroup;


  
  constructor(
    private conectarApiService:ConectarApiService,
    private formBuilder: FormBuilder,
    private router:Router,
  ){

    this.proveedores = this.formBuilder.group({
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ["", Validators.required]
    });

  }

  login() {


    const user = { 
      user_email: this.proveedores.value.user_email, 
      user_password: this.proveedores.value.user_password 
    };
  

 
    this.conectarApiService.login(user).subscribe((data) => {

     
      var body = document.body;// esta variable sive para quitar el estuilo que pone el sweetalert al body
      
      if(data.status == "ok"){
        localStorage.setItem('token',data.result.token)
        localStorage.setItem('idnum',data.result.idnum)
        this.router.navigate(['dashboard']);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Ingreso seguro" ,
          showConfirmButton: false,
          timer: 2500
        });
        body.classList.remove("swal2-height-auto");
      }else{

        Swal.fire({
          position: "top-end",
          icon: "warning",
          title: data.result.error_msg ,
          showConfirmButton: false,
          timer: 2500
        });
        body.classList.remove("swal2-height-auto");
      }
    });
  }



}
