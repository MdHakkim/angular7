import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  newPassword: FormGroup;
  isActive:boolean=true;
  activePlace:any=true;
  loginActive:any=true;
  forgotActive:boolean=true;
  contentActive:boolean=true;
  activeLogin:boolean=true;
  signCaption: string ="Sign Up";
  LoginCaption: string ='Login';
  getMailValue:any='';
  showWindowMessage:string;
  activePassword:boolean=false;
  elseContent:boolean=false;
  EmailValidation:boolean=false;
  signUpActive: boolean=true;
  submitted: boolean = false;
  redirectContent:boolean=false;
  faiconLogin ='<i class="fa fa-user"></i>';
  constructor(private routeParam: ActivatedRoute,public router: Router,private formBuilder: FormBuilder, public restApi: ApiServiceService) {
    this.newPassword = this.formBuilder.group({
      user_password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.restApi.loginTest();
   }
   
   ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      console.log(params,"tesing methods");
      if (params.id.length>0){
        this.forgotActive = false;
        this.contentActive = false;
        this.activeLogin=false;
        this.activePassword=true;
        this.signUpActive=false;
        this.LoginCaption='New Password';
        this.faiconLogin ='<i class="fa fa-lock" aria-hidden="true"></i>';
      }
    });
   }
  faIconHtml ='<i class="fa fa-lock" aria-hidden="true"></i>';
  forgotPassword(){
    this.elseContent = true;
    this.contentActive = true;
    this.activeLogin=false;
    this.loginActive=false;
    this.forgotActive=false;
    this.activePlace = false;
    this.signCaption = "Reset Password";
    this.faIconHtml ='<i class="fa fa-user" aria-hidden="true"></i>';
  }
  signUp(){
    if(!this.activePlace){
      console.log(this.getMailValue,"Hakkim");
      let emailAdd = { user_email: this.getMailValue };
      this.restApi.forgotPassword(emailAdd).subscribe((response) => {
        console.log(response, "test");
        this.showWindowMessage = response.msg;
        this.EmailValidation = true;
        // if (response.error_no!=0){
        setTimeout(() => {
          this.showWindowMessage='';
          this.EmailValidation = false;
        }, 3000);
      }, (err) => console.error(err), () => {
      });
    }else{
      this.restApi.loginTest(true);
      this.router.navigate(['/joinus']);
    }
  }
  
  submitBusiness(formData) {
    console.log(formData, "testing methods");
    this.submitted = true;
    if (this.newPassword.invalid) {
      return false;
    }
    this.restApi.createNewPassword(formData).subscribe((response) => {
      console.log(response, "BUIS");
      if(response.error_no == 0) {
       this.redirectContent=true;
      }else{
        this.showWindowMessage = response.msg;
        this.EmailValidation = true;
      }
      setTimeout(() => {
        this.showWindowMessage='';
        this.EmailValidation = false;
      }, 3000);
    }, err => {
     
    }, () => {
      
    });
  }

  getLoginPage(){
    this.redirectContent=false;
    this.router.navigate(['/login']);
  }
}
