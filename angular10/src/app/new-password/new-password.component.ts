import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  newPassword: FormGroup;
  isActive:boolean=true;
  constructor(private formBuilder: FormBuilder, public restApi: ApiServiceService) {
    this.newPassword = this.formBuilder.group({
      password: ['', Validators.required],
      retypepassword: ['', Validators.required],
      user_phone: [''],
      user_subject: [''],
      user_content: ['', Validators.required],
    });
    this.restApi.loginTest();
   }
   Email_Address1:any='Email Address test';
   ngOnInit(): void {

   }

  forgotPassword(){
    this.isActive =false;
    console.log(this.isActive);
  }
}
