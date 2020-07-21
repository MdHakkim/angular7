import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormArray,FormGroup,FormControl ,Validators,AbstractControl  } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  contactForm :FormGroup;
  constructor(public restApi: ApiServiceService,private formBuilder: FormBuilder) { 
    this.contactForm = this.formBuilder.group({
      user_name: ['', Validators.required],
      user_email: ['', Validators.required],
      user_phone: [''],
      user_subject: [''],
      user_content: ['', Validators.required],
    });
  }
  submitted:boolean = false;
  disabledButton=false;
  showDbMessage:any;
  showMsg:boolean=false;
  errorMessage:string;
  name:any;
  paragraph:any;
  ngOnInit(): void {
    this.errorMessage = "";
    this.restApi.footerPage(6).subscribe((response) => {
      this.name = response[0].pg_name;
      this.paragraph = response[0].pg_desc;
      console.log(response,"test");
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
    }
    )
  }
  get f() { return this.contactForm.controls; }
  submitForm(formData){
    this.submitted=true;
    if (this.contactForm.invalid) {
      return false; 
    }
    this.restApi.contactForm(formData).subscribe((response) => {
      console.log(response,"BUIS");
      if(response.error_no==0){
        this.disabledButton=true;
        this.showDbMessage='Email sent Successfully.';
        this.contactForm.reset();
      }else{
        this.disabledButton=true;
        this.showDbMessage='Failer ! '+response.error_no+'.';
      }
      this.showMsg= true;
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.showMsg= false;
      },6000);
    },err=>{
      this.disabledButton=false; 
    },()=>{
      this.disabledButton=false;
    });
  }
  
}
