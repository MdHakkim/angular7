import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';
import { Subscription, Observable } from 'rxjs';
import { Router, NavigationStart } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MustMatch } from '../password-validator';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/filter';
import { ShareDataService } from '../share-data.service';
@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent implements OnInit {
  newPassword: FormGroup;
  isActive: boolean = true;
  activePlace: any = true;
  loginActive: any = true;
  forgotActive: boolean = true;
  contentActive: boolean = true;
  activeLogin: boolean = true;
  signCaption: string = "S";
  LoginCaption: string = 'L';
  getMailValue: any = '';
  showWindowMessage: string;
  activePassword: boolean = false;
  elseContent: boolean = false;
  EmailValidation: boolean = false;
  signUpActive: boolean = true;
  submitted: boolean = false;
  redirectContent: boolean = false;
  faiconLogin = '<i class="fa fa-user"></i>';
  constructor(private sharedata: ShareDataService,private routeParam: ActivatedRoute, public router: Router, private formBuilder: FormBuilder, public restApi: ApiServiceService) {
    this.newPassword = this.formBuilder.group({
      user_password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
        validator: MustMatch('user_password', 'confirmPassword')
    });
    this.restApi.loginTest();
  }

  ngOnInit(): void {
    this.routeParam.params.subscribe(params => {
      console.log(Object.keys(params).length, "tesing methods");
      if (Object.keys(params).length > 0) {
        this.newPassword.addControl('user_token', new FormControl(''));
        let user_token = params.id;
        this.forgotActive = false;
        this.contentActive = false;
        this.activeLogin = false;
        this.activePassword = true;
        this.signUpActive = false;
        this.LoginCaption = 'New_Password';
        this.faiconLogin = '<i class="fa fa-lock" aria-hidden="true"></i>';
        this.newPassword.controls.user_token.setValue(user_token);
        this.emilIdLogin = '';
        this.getMailValue = '';
      }
    });
  }
  faIconHtml = '<i class="fa fa-lock" aria-hidden="true"></i>';
  forgotPassword() {
    this.elseContent = true;
    this.contentActive = true;
    this.activeLogin = false;
    this.loginActive = false;
    this.forgotActive = false;
    this.activePlace = false;
    this.signCaption = "R";
    this.faIconHtml = '<i class="fa fa-user" aria-hidden="true"></i>';
    this.emilIdLogin='';
    this.getMailValue='';
  }
  signUp() {
    if (!this.activePlace) {
      console.log(this.getMailValue, "Hakkim");
      let emailAdd = { user_email: this.getMailValue };
      this.restApi.forgotPassword(emailAdd).subscribe((response) => {
        console.log(response, "test");
        this.showWindowMessage = response.msg;
        this.EmailValidation = true;
        // if (response.error_no!=0){
        setTimeout(() => {
          this.showWindowMessage = '';
          this.EmailValidation = false;
        }, 3000);
      }, (err) => console.error(err), () => {
      });
    } else {
      this.restApi.loginTest(true);
      this.router.navigate(['/joinus']);
    }
  }
  get f() { return this.newPassword.controls; }
  submitBusiness(formData) {
    console.log(formData, "testing methods");
    this.submitted = true;
    if (this.newPassword.invalid) {
      return false;
    }
    this.restApi.createNewPassword(formData).subscribe((response) => {
      console.log(response, "BUIS");
      if (response.error_no == 0) {
        this.redirectContent = true;
      } else {
        this.showWindowMessage = response.msg;
        this.EmailValidation = true;
      }
      setTimeout(() => {
        this.showWindowMessage = '';
        this.EmailValidation = false;
      }, 3000);
    }, err => {

    });
  }

  getLoginPage() {
    this.redirectContent = false;
    this.router.navigate(['/login']);
  }
  goHomePage() {
    this.restApi.loginTest(true);
    this.router.navigate(['']);
  }
  emilIdLogin:any='';
  createNewPassword() {
    console.log(this.emilIdLogin,"EMPTY");
    if (typeof this.emilIdLogin != 'undefined' && this.emilIdLogin != ''){
    let logindata = { email: this.emilIdLogin, password: this.getMailValue };
    this.restApi.login(logindata).subscribe((response) => {
      console.log(response, "login");
      if (response.error_no == 0) {
        let editArray = [];
        let token = response.reult.token;
        let first_name = response.reult.first_name;
        editArray.push(token);
        editArray.push(this.emilIdLogin);
        localStorage.setItem('secure', JSON.stringify(editArray));
        localStorage.setItem('username', first_name);
        this.restApi.loginTest(true);
        let condition = [false, first_name];
        this.sharedata.callComponentMethod(condition);
        this.router.navigate(['']);
      } else {
        this.showWindowMessage = response.error_msg;
        this.EmailValidation = true;
        setTimeout(() => {
          this.showWindowMessage = '';
          this.EmailValidation = false;
        }, 3000);
      }
    });
  }
  }
}
