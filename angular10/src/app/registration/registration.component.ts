import { Component, ViewChild,ElementRef, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { FormBuilder,FormArray,FormGroup,FormControl ,Validators,AbstractControl  } from '@angular/forms';
import { ShareDataService } from '../share-data.service';
import { MustMatch } from '../password-validator';
import { filter } from 'rxjs/operators';
import { debounce, debounceTime,mergeMap,distinctUntilChanged,switchMap,timeout,concatMap,delay } from 'rxjs/operators';
import { Observable, timer, Subject, TimeoutError } from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import { Router } from '@angular/router';
// import 'rxjs/add/observable/of';
// import 'rxjs/add/operator/filter';
import { SidepanelComponent } from '../sidepanel/sidepanel.component';
declare var $:any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @ViewChild(SidepanelComponent) Sidepanel: SidepanelComponent;
  CaptionName: string = "Business Logo";
  bCaptionName: string = "Portfolio";
  isbShown: boolean = true;
  isiShown: boolean = false;
  langCondition:boolean=false;
  loginForm :FormGroup;
  checkoutForm :FormGroup;
  individualForm :FormGroup;
  arealist :any;
  area:any;
  ind_area:any;
  country :any;
  ind_country :any;
  countrylist :any;
  errorMessage:string;
  subscription_1:string;
  subscription_2:string;
  // agree:string='N';
  city:string;
  ind_city:string;
  citylist:any;
  business_type:string;
  ind_business_type:string;
  businesslist:string;
  servicelist:any;
  service_id:any;
  ind_service_id:string;
  subscrilist:string;
  businesbool:boolean = true;
  individubool:boolean = false;
  dynamicname:any=['subscription_1','subscription_2'];
  isChecked:boolean=false;
  loginsubmit:boolean = false;
  submitted:boolean = false;
  insubmitted:boolean = false;
  gender:string;
  defaultTab='B';
  showMsg:boolean=false;
  showDbMessage:string;
  contactcode:number;
  modelChanged: Subject<string> = new Subject<string>();
  tagservice :any = '';
  successMessage = '';
  bindForm='submitBusiness';
  disabledButton:any=true;
  agreeCheck:any=true;
  Agree:any='';
  geoLocation = localStorage.getItem("geoLocation");
  emailAddresss:any="";
  saveOtherLang:any="";
  lang_name: any ='Arabic also ?';
  saveOtherLng: boolean = false;
  saveContent: string ="Would you like to save in";
  //gender neeed to add.
  constructor(public restApi: ApiServiceService,private formBuilder: FormBuilder,private _elementRef : ElementRef,private sharedata:ShareDataService,private router: Router) {
    this.restApi.getLanguage().subscribe((response) => {
      this.searchCountry();
      this.lang_name = (response == 'en' ? "Arabic also ?" : "English also ?");
      this.restApi.get_city_Request(this.geoLocation, '').subscribe((response) => {
        this.citylist = response.result;
      });
      let Languge = this.restApi.lang_code;
      this.checkoutForm.get('lang_code').setValue(Languge);
      this.individualForm.get('lang_code').setValue(Languge);
    });
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.checkoutForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: '',
      business_name:'',
      contactcode:'',
      phone:'',
      contactno: [null, Validators.required],
      email: [null, [Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      website:'',
      add1: [null, Validators.required],
      add2:'',
      country:[null, Validators.required],
      area:'',
      city:'',
      business_type:[null, Validators.required],
      remarks:'',
      subscription_1:'',
      subscription_2:'',
      service_id: this.formBuilder.array([]),
      service_name: this.formBuilder.array([]),
      company:'COMPANY',
      common_id:'new',
      lang_code: this.restApi.lang_code,
      image_1:'',
      image_2:'',
      password:['', [Validators.required, Validators.minLength(6)]],
      retypepassword:['', Validators.required]},{
        validator: MustMatch('password', 'retypepassword')
    });
    this.individualForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: '',
      business_name:'',
      contactcode:'',
      contactno: [null, Validators.required],
      phone:'',
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      website:'',
      gender:'',
      add1: [null, Validators.required],
      add2:'',
      country:'',
      area:'',
      city:'',
      business_type:['', Validators.required],
      remarks:'',
      subscription_1:'',
      subscription_2:'',
      service_id: this.formBuilder.array([]),
      service_name: this.formBuilder.array([]),
      company:'INDIVIDUAL',
      common_id: 'new',
      lang_code: this.restApi.lang_code,
      image_1:'',
      image_2:'',
      password:['', [Validators.required, Validators.minLength(6)]],
      retypepassword:['', Validators.required]},{
        validator: MustMatch('password', 'retypepassword')
    });
   }
  
   keyupmethod(param){
    if(param=='B'){
      this.checkoutForm.get('phone').setValue(this.checkoutForm.get('contactcode').value+this.checkoutForm.get('contactno').value);
   }else{
      this.individualForm.get('phone').setValue(this.individualForm.get('contactcode').value+this.individualForm.get('contactno').value);
   }
  }
  @ViewChild('businessTab') elight: ElementRef;
  @ViewChild('individualTab') efiile: ElementRef;
  _success = new Subject<string>();
  ngOnInit(): void {
      this.searchCountry();
      this.restApi.get_city_Request(this.geoLocation,'').subscribe((response) => {
        this.citylist = response.result;
      });
      this._success.subscribe(message => this.successMessage = message);
      this._success.pipe(debounceTime(4000)).subscribe(() => this.successMessage = '');
      this.restApi.get_service_lov_Request('').subscribe((response) => {
          this.servicelist = response.result;
      });
      this.restApi.getLanguage().subscribe((response) => {
        if(this.isbShown){
          this.subscription('COMPANY');
        }else{
          this.subscription('INDIVIDUAL');
        }
      });
  }
  ngAfterViewInit() {
      setTimeout(() => {
      this.sharedata.getMessage().subscribe(
        (data) =>{ 
          if(data!=''){
          console.log(data,"testing me");
          if(data=='B'){
            this.businesbool=true;
            this.individubool=false;
            this.defaultTab='B';
            this.bindForm='submitBusiness';
          }else{  
            this.businesbool=false;
            this.individubool=true;
            this.defaultTab='I';
            this.bindForm='submitIndividual';
          }
          this.getbusiness(event,'');
        }else{
          this.getbusiness(event,'');
        }
        });
      });
      if(this.businesbool){
          this.subscription('COMPANY');
      }else{
        this.subscription('INDIVIDUAL');
      }
  }

  tagDescArray=[];
  tagIdArray=[];
  onSelect() {
    this.tagDescArray=[];
    this.tagIdArray=[];
    let tags = this.tagservice;
    if(tags==''){
      return true;
    }
    tags.forEach((tag) => {
      this.tagDescArray.push(tag);
      this.tagIdArray.push('NEW');
    });
    this.arrayServiceId();
  }

  arrayServiceId(){
    let serviceNameArray=[];
    let serviceIdArray=[];
    serviceNameArray= serviceNameArray.concat(this.selectDescArray);
    serviceNameArray= serviceNameArray.concat(this.tagDescArray);
    serviceIdArray= serviceIdArray.concat(this.selectIdArray);
    serviceIdArray= serviceIdArray.concat(this.tagIdArray);
    console.log(serviceNameArray,"MAin name FROMATED");
    console.log(serviceIdArray,"MAin id FROMATED");
    this.service_name.controls = [];
    this.service_arr_id.controls = [];
    this.indservice_name.controls = [];
    this.indservice_id.controls = [];
    serviceNameArray.forEach((desc) => {
      if(this.defaultTab=='B'){
        this.service_name.push(new FormControl(desc));
      }else{
        this.indservice_name.push(new FormControl(desc));
      }
    });
    serviceIdArray.forEach((id) => {
      if(this.defaultTab=='B'){
        this.service_arr_id.push(new FormControl(id));
      }else{
        this.indservice_id.push(new FormControl(id));
      }
    });
  }

  changeCity(event){
    let country = this.ind_country;
    this.ind_city=null;
    this.ind_area=null;
    if(this.defaultTab=='B'){
        country = this.country;
        this.city=null;
        this.area=null;
    }
    let citydesc = '';
    this.restApi.get_city_Request(country,citydesc).subscribe((response) => {
      this.citylist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }
  changeArea(event){
    let city = this.ind_city;
    this.ind_area=null;
    if(this.defaultTab=='B'){
      city = this.city;
      this.area=null;
    }
    this.restApi.get_area_Request(city,'').subscribe((response) => {
      this.arealist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }

  getcity(event){
    let country = this.ind_country;
    if(this.defaultTab=='B'){
      country = this.country;
    }
    let citydesc = event.target.value;
    this.restApi.get_city_Request(country,citydesc).subscribe((response) => {
      this.citylist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }

  getArea(event){
    let city = this.ind_city;
    if(this.defaultTab=='B'){
      city = this.city;
    }
    let citydesc = event.target.value;
    this.restApi.get_area_Request(city,citydesc).subscribe((response) => {
      this.arealist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }
  getbusiness(event,param){
    let desc ='';
    if(param!=''){
      desc = event.target.value;
    }
    let defalut = 'INDIVIDUAL';
    if(this.defaultTab=='B'){
      defalut = 'COMPANY';
    }
    this.restApi.get_business_type_Request(defalut,desc).subscribe((response) => {
      this.businesslist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }
  getservice(event){
      let desc = event.target.value;
      this.restApi.get_service_lov_Request(desc).subscribe((response) => {
        this.servicelist = response.result;
        console.log(response,"test");
      },(err) => console.error(err),()=>{
      });
    
  }
  sideBarToggle(event,param){
    this.Agree='';
    if(param=="B"){
      this.CaptionName = "Business Logo";
      this.bCaptionName= "Portfolio";
      this.isiShown=false;
      this.isbShown = true;
      this.subscription('COMPANY');
      this.defaultTab='B';
      this.tagservice='';
      this.checkoutForm.reset();
      this.bindForm='submitBusiness';
      this.service_id="";
      this.agreeCheck=true;
      this.checkoutForm.get('common_id').setValue('new');
      this.checkoutForm.get('company').setValue('COMPANY');
      let Languge = this.restApi.lang_code;
      this.checkoutForm.get('lang_code').setValue(Languge);
    }else{
      this.CaptionName = "Individual Logo";
      this.bCaptionName= "Portfolio";
      this.isiShown = true;
      this.isbShown = false;
      this.subscription('INDIVIDUAL');
      this.defaultTab='I';
      this.tagservice='';
      this.individualForm.reset();
      this.bindForm='submitIndividual';
      this.ind_service_id="";
      this.agreeCheck=true;
      this.individualForm.get('common_id').setValue('new');
      this.individualForm.get('company').setValue('INDIVIDUAL');
      let Languge = this.restApi.lang_code;
      this.individualForm.get('lang_code').setValue(Languge);
    }
    this.getbusiness(event,'');
    setTimeout (() => {
      this.country=Number(this.geoLocation);
      this.ind_country=Number(this.geoLocation);
    },200);
    this.langCondition = false;
  }

  subscription(defaults){
    this.errorMessage = "";
    let lang = this.restApi.lang_code;
    this.restApi.get_subscription_Request('',defaults,lang).subscribe((response) => {
      this.subscrilist = response.result;
      console.log(response,"test");
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
    });
  }
  
  searchCountry(){
    this.errorMessage = "";
    // return new Promise((resolve, reject) => {        
    this.restApi.get_country_Request().subscribe((response) => {
      this.countrylist = response;
      this.country=Number(this.geoLocation);
      // resolve();
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
    });
    // });
  }

  childImagemitter($event){
    console.log($event,"TESING");
    if($event.title=='Logo'){
      const imageName = this.checkoutForm.get('image_1') as FormControl;
      imageName.setValue($event.content);
    }else if($event.title=='Profile'){
      const imageName = this.checkoutForm.get('image_2') as FormControl;
      imageName.setValue($event.content);
    }else if($event.title=='I_Profile'){
      const imageName = this.individualForm.get('image_2') as FormControl;
      imageName.setValue($event.content);
    }
    
  }
  agreeRadion(event){
    this.agreeCheck=!event.target.checked;
  }
  submitBusiness(formData){    
    console.log(formData,"testing methods");
    this.submitted=true;
    if (this.checkoutForm.invalid) {
      return false; 
    }
    this.restApi.submitRegistration(formData).subscribe((response) => {
      console.log(response,"BUIS");
      if(response.error_no==0){
        this.disabledButton=true;
        this.showDbMessage ='Registration Success! Confirmation Email has been sent to your register email.';
        let checkEmail = this.checkoutForm.get('email').value;
        let checkpassword = this.checkoutForm.get('password').value;
        let checkretypepassword = this.checkoutForm.get('retypepassword').value;
        this.checkoutForm.reset();
        this.Sidepanel.restImage('B');
        this.checkoutForm.get('company').setValue('COMPANY');
        let Languge = this.restApi.lang_code;
        this.checkoutForm.get('lang_code').setValue(Languge);
        this.service_id="";
        if (this.saveOtherLng) {
          let element: HTMLElement = document.getElementById('languageSet') as HTMLElement;
          element.click();
          this.checkoutForm.get('email').setValue(checkEmail);
          this.checkoutForm.get('password').setValue(checkpassword);
          this.checkoutForm.get('retypepassword').setValue(checkretypepassword);
          this.langCondition=true;
          this.saveOtherLang = false;
          this.saveOtherLng = false;
          let comman_sys = response.common_id;
          this.checkoutForm.get('common_id').setValue(comman_sys);
        }else{
          this.checkoutForm.get('common_id').setValue("new");
          this.langCondition = false;
        }
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

  submitIndividual(indformData){
    console.log(indformData,"individal methods");
    this.insubmitted=true;
    if (this.individualForm.invalid) {
      return false;
    }
    this.restApi.submitRegistration(indformData).subscribe((response) => {
      console.log(response,"INDIVI");
      if(response.error_no==0){
        this.disabledButton=true;
        this.showDbMessage='Registration Success! Confirmation Email has been sent to your register email.';
        let checkEmail = this.individualForm.get('email').value;
        let checkpassword = this.individualForm.get('password').value;
        let checkretypepassword = this.individualForm.get('retypepassword').value;
        this.individualForm.reset();  
        this.Sidepanel.restImage('I');
        this.individualForm.get('company').setValue('INDIVIDUAL');
        let Languge = this.restApi.lang_code;
        this.individualForm.get('lang_code').setValue(Languge);
        this.ind_service_id="";
        if (this.saveOtherLng) {
          let element: HTMLElement = document.getElementById('languageSet') as HTMLElement;
          element.click();
          this.individualForm.get('email').setValue(checkEmail);
          this.individualForm.get('password').setValue(checkpassword);
          this.individualForm.get('retypepassword').setValue(checkretypepassword);
          this.langCondition = true;
          this.saveOtherLang = false;
          this.saveOtherLng = false;
          let comman_sys = response.common_id;
          this.individualForm.get('common_id').setValue(comman_sys);
        }else{
          this.individualForm.get('common_id').setValue('new');
          this.langCondition = false;
        }
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

  get service_name(): FormArray {
    return this.checkoutForm.get("service_name") as FormArray
  }
  get service_arr_id(): FormArray {
    return this.checkoutForm.get("service_id") as FormArray
  }
  get indservice_name(): FormArray {
    return this.individualForm.get("service_name") as FormArray
  }
  get indservice_id(): FormArray {
    return this.individualForm.get("service_id") as FormArray
  }
  onkeyInput(){
    let code = this.checkoutForm.get('contactcode').value;
    let phoneno = this.checkoutForm.get('phone').value;
    this.checkoutForm.patchValue({phone: code+phoneno});
  }

  selectDescArray:any=[];
  selectIdArray:any=[];
  onChangeService(event):void{
    this.selectDescArray=[];
    this.selectIdArray=[];
    if(event!=0){
      console.log(event,"EVENT HANDLIER");
      event.forEach((id) => {
        let descrption = this.servicelist.filter(item => item.id === id)[0].desc_new;
          this.selectDescArray.push(descrption);
        console.log(descrption, "EVENT descrption");
          this.selectIdArray.push(id);
      });
    }
    this.arrayServiceId();
  }

  get f() { return this.checkoutForm.controls; }
  get i() { return this.individualForm.controls; }
  get lg() { return this.loginForm.controls; }
  getcheckValue(event,params){
    let nameAttr = event.target.getAttribute("name");
    let getname;
    if(params=='B'){
      getname = this.checkoutForm.get(nameAttr) as FormControl;
    }else{
      getname = this.individualForm.get(nameAttr) as FormControl;
    }
    if(event.target.checked){
      getname.setValue(event.target.value);
    }else{
      getname.setValue('');
    }
  }

  checkValue(event){
    console.log(event,"checkValue");
  }
  email:any;
  login(logindata){
    console.log(logindata);
    this.loginsubmit=true;
    if (this.loginForm.invalid) {
      return false;
    }
    this.restApi.login(logindata).subscribe((response) => {
      console.log(response,"login");
      if(response.error_no==0){
        let editArray = [];
        let token = response.reult.token;
        let lastname = response.reult.last_name;
        editArray.push(token);
        editArray.push(this.email);
        localStorage.setItem('secure', JSON.stringify(editArray));
        this._success.next('Great! Login Successfully.');
        this.loginForm.reset();  
        this.router.navigate(['/editProfile']);
      }else{
        this._success.next('Failer! '+response.error_msg+'.');
      }
    });
  }

  saveOtherlangEvn(event){
    if (event.target.checked){
      this.saveOtherLng = true;
    }else{
      this.saveOtherLng = false;
    }
  }
  // tag component 
  // EmailMessage=false;
  // showWindowMessage='';
  // generatePassword(){
  //   let getEmail = this.emailAddresss;
  //   if(getEmail!==''){
  //     this.EmailMessage = false;
  //     this.restApi.forgotPassword(getEmail).subscribe((response) => {

  //     });
  //   }else{
  //     this.EmailMessage = true;
  //     this.showWindowMessage = 'Email verfication link send to your register email address.';
  //     setTimeout(()=> {
  //       this.showWindowMessage='';
  //       this.EmailMessage = false;
  //     }, 3000);
  //   }
  // }
}
