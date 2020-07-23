import { Component, ViewChild,ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder,FormArray,FormGroup,FormControl ,Validators,AbstractControl  } from '@angular/forms';
import { ApiServiceService } from '../api-service.service';
import { Observable, timer, Subject, TimeoutError } from 'rxjs';
import { ShareDataService } from '../share-data.service';
import { debounce, debounceTime,mergeMap,distinctUntilChanged,switchMap,timeout,concatMap,delay } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
// import {DomSanitizationService} from '@angular/platform-browser';


declare var $:any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  CaptionName: string = "Business Logo";
  bCaptionName: string = "Business Profile";
  isbShown: boolean = true;
  isiShown: boolean = false;
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
  subscription_1:any;
  subscription_2:any;
  agree:string='N';
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
  // defaultTab='B';
  showMsg:boolean=false;
  showDbMessage:string;
  // contactcode:number;
  modelChanged: Subject<string> = new Subject<string>();
  tagservice :any = '';
  successMessage = '';
  getEmail:any='';
  getToken:any='';
  setimages:string;
  fileData: File = null;
  LogoUrl:any = '';
  previewUrl:any = '';
  imageArray :object;
  Titlecaption:string;
  isCompany:boolean=false;
  commoncaption='Type_of_business';
  constructor(public restApi: ApiServiceService,private formBuilder: FormBuilder,private _elementRef : ElementRef,private sharedata:ShareDataService,private router: Router,private sanitizer: DomSanitizer){
    this.checkoutForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: '',
      business_name:'',
      // contactcode:'',
      phone:'',
      gender:'',
      email:'',
      website:'',
      add1:'',
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
      company:'',
      token:'',
      image_1:'',
      image_2:'',      
    });
  }
  keyupmethod(){
    console.log(this.checkoutForm.get("contactno").value);
    this.checkoutForm.get('phone').setValue(this.checkoutForm.get('contactcode').value+this.checkoutForm.get('contactno').value)
  }
  _success = new Subject<string>();
  ngOnInit(): void {
    this.router.navigateByUrl(this.router.url);
    this.searchCountry();
    this._success.subscribe(message => this.successMessage = message);
    this._success.pipe(debounceTime(4000)).subscribe(() => this.successMessage = '');
  }
  @ViewChild('mutltiselect') selectElRef;
  meaction:any='';
  ngAfterViewInit() {
      this.sharedata.getMessage().subscribe(
      (data) =>{ 
        console.log(data,"testingmore");
        this.getToken=data[0];
        this.getEmail=data[1];
      });
    this.errorMessage = "";
    const getSecure = JSON.parse(localStorage.getItem("secure"));
    let token = getSecure[0];
    let email = getSecure[1];
    this.restApi.fetch_editProfile(email,token).subscribe((response) => {
      console.log(response.result,"test");
      let json = response.result[0];
      this.subscription_1=true;
      this.checkoutForm.patchValue(json);
      this.checkoutForm.controls['token'].setValue(token);
      this.checkoutForm.controls['business_name'].setValue(json.display_name);
      this.checkoutForm.controls['add1'].setValue(json.address_1);
      this.checkoutForm.controls['add2'].setValue(json.address_2);
      this.checkoutForm.controls['phone'].setValue(json.ph_no);
      this.country=Number(json.country_code);
      this.checkoutForm.controls['company'].setValue(json.org_type);
      if(json.org_type=='COMPANY'){
        this.isCompany=true;
        this.commoncaption='Type_of_business';
        this.Titlecaption='Business';
        // this.imageArray = [{Name:'Logo',Condition:'LogoUrl',Flag:'L'},{Name:'Portfolio',Condition:'previewUrl',Flag:'P'}];
      }else{
        this.isCompany=false;
        this.commoncaption='Type_of_Service';
        this.Titlecaption='Individual';
        // this.imageArray = [{Name:'Profile',Condition:'previewUrl',Flag:'P'}];
      }
      this.imageArray = [{Name:'Logo',Condition:'LogoUrl',Flag:'L'},{Name:'Portfolio',Condition:'previewUrl',Flag:'P'}];
      let condition=[false,json.last_name];
      this.sharedata.callComponentMethod(condition);
      localStorage.setItem('username',json.last_name);
      this.restApi.get_city_Request(json.country_code,json.city_code).subscribe((response) => {
        this.citylist = response.result;
        this.city=json.city_code;
      },(err) => console.error(err),()=>{
        
      });
      this.restApi.get_area_Request(json.city_code,json.area_code).subscribe((response) => {
        this.arealist = response.result;
        this.checkoutForm.controls['area'].setValue(json.area_code);
      },(err) => console.error(err),()=>{
        
      });
      this.restApi.get_business_type_Request('COMPANY',json.business_type_desc).subscribe((response) => {
        this.businesslist = response.result;
        this.checkoutForm.controls['business_type'].setValue(json.business_type);
      },(err) => console.error(err),()=>{
        
      });
      
      let serviceId=[];
      let serviceArray=[];
      json.service.forEach(servId => {
        let object = {id:servId.service_id,desc:servId.service_name};
        this.selectDescArray.push(servId.service_name);
        this.selectIdArray.push(servId.service_id);
        serviceArray.push(object);
        serviceId.push(servId.service_id);
      });
      this.servicelist=serviceArray;
      this.service_id=serviceId;
      this.LogoUrl=json.image_1;
      console.log();
      if(json.image_2==''){
        this.previewUrl=this.sanitizer.bypassSecurityTrustResourceUrl('assets/image/bg.png');
      }else{
        this.previewUrl=this.sanitizer.bypassSecurityTrustResourceUrl(<string>json.image_2);
      }
      
      this.arrayServiceId();
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
    }
    )
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
    serviceNameArray.forEach((desc) => {
        this.service_name.push(new FormControl(desc));
    });
    serviceIdArray.forEach((id) => {
        this.service_arr_id.push(new FormControl(id));
    });
  }

  getcity(event){
    let country = this.ind_country;
      country = this.country;
    let citydesc = event.target.value;
    this.restApi.get_city_Request(country,citydesc).subscribe((response) => {
      this.citylist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }

  getArea(event){
    let city = this.ind_city;
      city = this.city;
    let citydesc = event.target.value;
    this.restApi.get_area_Request(city,citydesc).subscribe((response) => {
      this.arealist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }
  getbusiness(event){
    let desc = event.target.value;
    let defalut = 'INDIVIDUAL';
    if(this.isCompany){
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

  subscription(defaults){
    let cntyCode= this.country;
    this.errorMessage = "";
    let lang = this.restApi.lang_code;
    this.restApi.get_subscription_Request(cntyCode,defaults,lang).subscribe((response) => {
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

  submitBusiness(formData){
    this.service_arr_id.push(new FormControl('New'));
    console.log(formData,"testing methods");
    this.submitted=true;
    if (this.checkoutForm.invalid) {
      return false; 
    }
    
    this.restApi.updateProfile(formData).subscribe((response) => {
      console.log(response,"BUIS");
      if(response.error_no==0){
        this.showDbMessage='Profile updated successfully.';
      }else{
        this.showDbMessage='Failer ! '+response.error_no+'.';
      }
      this.showMsg= true;
      window.scrollTo(0, 0);
      setTimeout(() => {
        this.showMsg= false;
      },6000);
    });
  }
  get service_name(): FormArray {
    return this.checkoutForm.get("service_name") as FormArray
  }
  get service_arr_id(): FormArray {
    return this.checkoutForm.get("service_id") as FormArray
  }
  selectDescArray:any=[];
  selectIdArray:any=[];
  onChangeService(event):void{
    this.selectDescArray=[];
    this.selectIdArray=[];
    if(event!=0){
      event.forEach((id) => {
          let descrption = this.servicelist.filter(item => item.id === id)[0].desc;
          this.selectDescArray.push(descrption);
          this.selectIdArray.push(id);
      });
    }
    this.arrayServiceId();
  }
  get f() { return this.checkoutForm.controls; }
  getcheckValue(event){
    let nameAttr = event.target.getAttribute("name");
    const getname = this.checkoutForm.get(nameAttr) as FormControl;
    if(event.target.checked){
      getname.setValue(event.target.value);
    }else{
      getname.setValue('');
    }
  }
  changeCity(){
    this.city=null;
    this.area=null;
    let country=this.country;
    this.restApi.get_city_Request(country,'').subscribe((response) => {
      this.citylist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }
  changeArea(){
    this.area=null;
    let city=this.city;
    this.restApi.get_area_Request(city,'').subscribe((response) => {
      this.arealist = response.result;
      console.log(response,"test");
    },(err) => console.error(err),()=>{
    });
  }
  checkValue(event){
    console.log(event,"checkValue");
  }
  
  fileProgress(fileInput: any,param) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview(param);
  }
  preview(param) {
    var mimeType = this.fileData.type;
    let fileSize = this.fileData.size;
    if(fileSize>2000000){
      return false;
    }
    if(param=='L'){
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
    }else{
      if (mimeType.match('application/pdf') == null) {
        return;
      }
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => {
      if(param=='L'){
        this.LogoUrl = reader.result; 
        const imageName = this.checkoutForm.get('image_1') as FormControl;
        imageName.setValue(this.LogoUrl);
      }else{
        // let url = URL.createObjectURL(this.previewUrl);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(<string>reader.result); 
        // console.log(this.previewUrl.changingThisBreaksApplicationSecurity,"hakkim teisng"); 
        const imageName = this.checkoutForm.get('image_2') as FormControl;
        imageName.setValue(this.previewUrl);
      }
      
    }
  }
}