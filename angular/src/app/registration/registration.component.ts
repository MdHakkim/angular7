import { Component, ViewChild,ElementRef, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { FormBuilder,FormArray,FormGroup,FormControl ,Validators  } from '@angular/forms';
import { ShareDataService } from '../share-data.service';
import { MustMatch } from '../password-validator';
import { filter } from 'rxjs/operators';
declare var $:any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  CaptionName: string = "Business Logo";
  bCaptionName: string = "Business Profile";
  isbShown: boolean = true;
  isiShown: boolean = false;
  checkoutForm :FormGroup;
  individualForm :FormGroup;
  arealist :any;
  area:any;
  ind_area:any;
  country :any;
  ind_country :any;
  countrylist :any;
  errorMessage:string;
  permiummonth:string='N';
  permiumyear:string='N';
  agree:string='N';
  city:string;
  ind_city:string;
  citylist:any;
  business_type:string;
  ind_business_type:string;
  businesslist:string;
  servicelist:any;
  service_id:string;
  ind_service_id:string;
  subscrilist:string;
  businesbool:boolean = true;
  individubool:boolean = false;
  dynamicname:any=['permiummonth','permiumyear'];
  isChecked:boolean=false;
  submitted:boolean = false;
  insubmitted:boolean = false;
  gender:string;
  defaultTab='B';
  showMsg:boolean=false;
  showDbMessage:string;
  //gender neeed to add.
  constructor(public restApi: ApiServiceService,private formBuilder: FormBuilder,private _elementRef : ElementRef,private sharedata:ShareDataService) {
    // setTimeout(() => this.checkoutForm.disable(), 100);
    this.checkoutForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: '',
      business_name:'',
      contactcode:'',
      phone:'',
      email:'',
      website:'',
      add1:'',
      add2:'',
      country:'',
      area:'',
      city:'',
      business_type:'',
      remarks:'',
      subscription_1:'',
      subscription_2:'',
      service_id: new FormControl(),
      service_name: this.formBuilder.array(['TEST']),
      company:'COMPANY',
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
      phone:'',
      email:'',
      website:'',
      gender:'',
      add1:'',
      add2:'',
      country:'',
      area:'',
      city:'',
      business_type:'',
      remarks:'',
      subscription_1:'',
      subscription_2:'',
      service_id: new FormControl(),
      service_name: this.formBuilder.array(['TEST']),
      company:'INDIVIDUAL',
      image_1:'',
      image_2:'',
      password:['', [Validators.required, Validators.minLength(6)]],
      retypepassword:['', Validators.required]},{
        validator: MustMatch('password', 'retypepassword')
    });
   }
  @ViewChild('businessTab') elight: ElementRef;
  @ViewChild('individualTab') efiile: ElementRef;
  ngOnInit(): void {
    this.searchCountry();
    this.country='0';
    this.ind_country='0';
    this.area='0';
    this.ind_area='0';
    this.city='0';
    this.ind_city='0';
    this.business_type='0';
    this.ind_business_type='0';
    this.service_id='0';
    this.ind_service_id='0';
  }
  ngAfterViewInit() {
    $('.selectpicker').selectpicker();
      let cityevent = this._elementRef.nativeElement.querySelectorAll('.cityprnt');
      let areaevent = this._elementRef.nativeElement.querySelectorAll('.areaprnt');
      let businessevent = this._elementRef.nativeElement.querySelectorAll('.businessprnt');
      let serviceevent = this._elementRef.nativeElement.querySelectorAll('.serviceprnt');
      // let cityevent = this._elementRef.nativeElement.querySelectorAll('.cityprnt .form-control')[2];
      for (let i = 0; i < 2; i++) {
        let citycontrol= cityevent[i].querySelectorAll('.form-control')[2];
        citycontrol.addEventListener('keyup',this.getcity.bind(this));
        let areacontrol= areaevent[i].querySelectorAll('.form-control')[2];
        areacontrol.addEventListener('keyup',this.getArea.bind(this));
        let businesscontrol= businessevent[i].querySelectorAll('.form-control')[2];
        businesscontrol.addEventListener('keyup',this.getbusiness.bind(this),this.businesbool);
        let servicecontrol= serviceevent[i].querySelectorAll('.form-control')[2];
        servicecontrol.addEventListener('keyup',this.getservice.bind(this));
      }
      setTimeout(() => {
      this.sharedata.getMessage().subscribe(
        (data) =>{ 
          if(data!=''){
          console.log(data,"testing me");
          if(data=='B'){
            this.businesbool=true;
            this.individubool=false;
            this.defaultTab='B';
          }else{  
            this.businesbool=false;
            this.individubool=true;
            this.defaultTab='I';
          }
        }
        });
      });
      if(this.businesbool){
          this.subscription('COMPANY');
      }else{
        this.subscription('INDIVIDUAL');
      }
  }

  // get cities(): FormArray {
  //   return this.checkoutForm.get('service') as FormArray;
  // }
  insertArray(parsam) {
    // this.service.push(parsam);
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
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      },100);
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
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      },100);
    });
  }
  getbusiness(event,checkParam){
    let desc = event.target.value;
    let defalut = 'INDIVIDUAL';
    if(checkParam){
      defalut = 'COMPANY';
    }
    this.restApi.get_business_type_Request(defalut,desc).subscribe((response) => {
      this.businesslist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      },100);
    });
  }
  getservice(event){
    let city = this.city;
    if(this.defaultTab=='B'){
      city = this.city;
    }
    let desc = event.target.value;
    // let defalut = 'COMPANY';
    this.restApi.get_service_lov_Request(desc).subscribe((response) => {
      this.servicelist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
      setTimeout(() => {
        $('.selectpicker').selectpicker('refresh');
      },100);
    });
  }
  sideBarToggle(event,param){
    if(param=="B"){
      this.CaptionName = "Business Logo";
      this.bCaptionName= "Business Profile";
      this.isiShown=false;
      this.isbShown = true;
      this.subscription('COMPANY');
      this.defaultTab='B';
    }else{
      this.CaptionName = "Individual Photo";
      this.isbShown = false;
      this.isiShown = true;
      this.subscription('INDIVIDUAL');
      this.defaultTab='I';
    }
  }

  subscription(defaults){
    let cntyCode= this.country;
    // let defaults= 'INDIVIDUAL';
    this.errorMessage = "";
    this.restApi.get_subscription_Request(cntyCode,defaults).subscribe((response) => {
      this.subscrilist = response.result;
      console.log(response,"test");
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
    }
    )
  }
  searchCountry(){
    this.errorMessage = "";
    this.restApi.get_country_Request().subscribe((response) => {
      this.countrylist = response;
      console.log(response,"test");
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
    }
    )
  }

  checkBoxGet(e){
    if(e.target.checked){
      console.log(e.target.value,"TESTs");
      this.checkoutForm.get("subscription_1").setValue(e.target.value);
    }
  }

  submitFunc(formData){
    // this.onkeyInput();
    console.log(formData,"testing methods");
    this.submitted=true;
    if (this.checkoutForm.invalid) {
      return;
  }
    this.restApi.submitRegistration(formData).subscribe((response) => {
      console.log(response,"BUIS");
      if(response.error_no==0){
        this.showDbMessage='Registration Success!.';
      }else{
        this.showDbMessage='Failer ! '+response.error_no+'.';
      }
      this.showMsg= true;
      setTimeout(() => {
        this.showMsg= false;
      },6000);
    });
  }

  submitIndividual(indformData){
    console.log(indformData,"individal methods");
    this.insubmitted=true;
    if (this.individualForm.invalid) {
      return;
  }
    this.restApi.submitRegistration(indformData).subscribe((response) => {
      console.log(response,"INDIVI");
      if(response.error_no==0){
        this.showDbMessage='Registration Success!.';
      }else{
        this.showDbMessage='Failer ! '+response.error_no+'.';
      }
      this.showMsg= true;
      setTimeout(() => {
        this.showMsg= false;
      },6000);
    });
  }

  get teachers(): FormArray {
    return this.checkoutForm.get("service_name") as FormArray
  }
  onkeyInput(){
    let code = this.checkoutForm.get('contactcode').value;
    let phoneno = this.checkoutForm.get('phone').value;
    this.checkoutForm.patchValue({phone: code+phoneno});
  }
  onChange(event){
    let selectedOptions = event.target['options'];
    let selectedIndex = selectedOptions.selectedIndex;
    let selectElementText = selectedOptions[selectedIndex].text;
    console.log(selectElementText); 

  }

  get f() { return this.checkoutForm.controls; }
  get i() { return this.individualForm.controls; }

  changeCity(){
    // this.citylist="";
    this.city='0';
    $('.selectpicker').selectpicker('refresh');
  }
  checkValue(event){
    console.log(event,"checkValue");
  }
}
