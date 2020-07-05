import { Component, OnInit } from '@angular/core';
import { Router,NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { ShareDataService } from '../share-data.service';
import { ApiServiceService } from '../api-service.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  condition:boolean=true;
  userName:any='';
  errorMessage:any;
  constructor(public router: Router,private sharedata:ShareDataService,public restApi: ApiServiceService,private translate: TranslateService) { 
    translate.setDefaultLang('en');
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
  }
  exploreClick(){
    this.router.navigate(['/explore']);
  }
  joinUsClick(){
    this.router.navigate(['/joinus']);
  }
  logout(){
    localStorage.removeItem('secure');
    localStorage.removeItem('username');
    this.condition=true;
    this.router.navigate(['']);    
  }
}
