import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  newPassword: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.newPassword = this.formBuilder.group({
      password: ['', Validators.required],
      retypepassword: ['', Validators.required],
      user_phone: [''],
      user_subject: [''],
      user_content: ['', Validators.required],
    });
   }

  ngOnInit(): void {
  }

}
