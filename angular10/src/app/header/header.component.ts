import { Component, OnInit,Inject  } from '@angular/core';
import { Router,NavigationStart } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { ShareDataService } from '../share-data.service';
import { ApiServiceService } from '../api-service.service';
import {TranslateService} from '@ngx-translate/core';
import { DOCUMENT } from '@angular/common';
// import { Observable } from "rxjs";
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
  errorMessage:any;
  isLoggedIn: Observable<boolean>;
  logoLang:any='assets/image/logo_en.png';
  constructor(public router: Router,private sharedata:ShareDataService,public restApi: ApiServiceService,private translate: TranslateService,@Inject(DOCUMENT) private document: Document) { 
    translate.setDefaultLang('en');
    this.changeCssFile('en');
    this.languageDrop='العربية';
    this.languageSet='ar';
    this.restApi.lang_code='en';
    this.isLoggedIn = this.restApi.isLoggedIn();
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
    this.logoLang = (lang=='en' ? 'assets/image/logo_en.png' : 'assets/image/logo_ar.png');
    this.restApi.lang_code=lang;
    this.languageDrop=langSet;
    this.languageSet=langSets;
    this.restApi.languageChange(lang);
  }
  changeCssFile(lang: string) {
    let headTag = this.document.getElementsByTagName('head')[0];
    let existingLink = this.document.getElementById('langCss') as HTMLLinkElement;;
    let bundleName = lang === 'ar' ?  'arabic.css':'english.css';
    if (existingLink) {
       existingLink.href = bundleName;
    } else {
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
    this.router.navigate(['/joinus']);
    this.restApi.loginTest();
  }
  logout(){
    localStorage.removeItem('secure');
    localStorage.removeItem('username');
    this.condition=true;
    this.router.navigate(['']);    
  }
}
