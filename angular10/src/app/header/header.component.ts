import { Component, OnInit,Inject  } from '@angular/core';
import { Router,NavigationStart } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ShareDataService } from '../share-data.service';
import { ApiServiceService } from '../api-service.service';
import {TranslateService} from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  condition:boolean=true;
  userName:any='';
  languageDrop:any='';
  languageSet:any='';
  checkoutForm: FormGroup;
  errorMessage:any;
  subscrilist:any='';
  isLoggedIn: Observable<boolean>;
  logoLang:any='assets/image/logo_en1.png';
  windowOpen: any = 'none';
  constructor(public router: Router, private sharedata: ShareDataService, public restApi: ApiServiceService, private translate: TranslateService, @Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder,) { 
    translate.setDefaultLang('en');
    this.changeCssFile('en');
    this.languageDrop='العربية';
    this.languageSet='ar';
    this.restApi.lang_code='en';
    this.isLoggedIn = this.restApi.isLoggedIn();
    this.checkoutForm = this.formBuilder.group({
      subscription1: this.formBuilder.array([]),
      email:[''],
      token:[''],
      lang_code:['']
    });
  }
  ngOnInit(): void {  
    const getSecure = JSON.parse(localStorage.getItem("secure"));
    const getUser = localStorage.getItem("username");
    if(getSecure){
      this.condition=false;
      this.userName=getUser;
    }
    this.sharedata.customObservable.subscribe((res) => {
      this.condition=res[0];
      this.userName=res[1];
    }); 
  }
  transulate(lang){
    this.translate.use(lang);
    this.changeCssFile(lang);
    let langSet = (lang=='en' ? 'العربية' : 'English');
    let langSets = (lang=='en' ? 'ar' : 'en');
    this.logoLang = (lang=='en' ? 'assets/image/logo_en1.png' : 'assets/image/logo_ar.png');
    this.restApi.lang_code=lang;
    this.languageDrop=langSet;
    this.languageSet=langSets;
    this.restApi.languageChange(lang);
  }
  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName('head')[0];
    let existingLink = this.document.getElementById('langCss') as HTMLLinkElement;
    let bundleName = lang === 'ar' ?  'arabic.css':'english.css';
    if(existingLink) {
      existingLink.href = bundleName;
    }else {
      const newLink = this.document.createElement('link');
      newLink.rel = 'stylesheet';
      newLink.type = 'text/css';
      newLink.id = 'langCss';
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
    }
  exploreClick(){
    this.router.navigate(['/explore']);
  }
  joinUsClick(){
    this.router.navigate(['/login']);
    this.restApi.loginTest();
  }
  logout(){
    localStorage.removeItem('secure');
    localStorage.removeItem('username');
    this.condition=true;
    this.router.navigate(['/login']);    
  }

  subscription(defaults ='COMPANY') {
    this.errorMessage = "";
    let lang = this.restApi.lang_code;
    this.restApi.get_subscription_Request('', defaults, lang).subscribe((response) => {
      this.subscrilist = response.result;
      console.log(response, "subSciption");
      // this.subscription_1= true;
      // this.subscription_2 = false;
    },
      (error) => {
        console.error('Request failed with error')
        this.errorMessage = error;
      });
  }

  openModal(){
    this.subscription1.controls = [];
    let Languge = this.restApi.lang_code;
    const getSecure = JSON.parse(localStorage.getItem("secure"));
    let token = getSecure[0];
    let email = getSecure[1];
    this.checkoutForm.get('email').setValue(email);
    this.checkoutForm.get('token').setValue(token);
    this.checkoutForm.get('lang_code').setValue(Languge);
    this.windowOpen='block';
    this.subscription();
  }
  closeModal() {
    this.windowOpen = 'none';
  }

  get subscription1(): FormArray {
    return this.checkoutForm.get("subscription1") as FormArray
  }

  getcheckValue(e){
    let value = e.target.value;
    if (e.target.checked){
      this.subscription1.push(new FormControl(value));
    }else{
      let index = this.subscription1.controls.findIndex(x => x.value == value);
      this.subscription1.removeAt(index);
    }
  }

  submitPermium(formData){
    console.log(formData.subscription1[0],"FORM DATA");
    this.restApi.fetch_premiumUrl(formData).subscribe((response) => {
      console.log(response.result, "test");

    });
  }

}
