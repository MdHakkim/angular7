import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams,HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
import { ApiServiceService } from './api-service.service';
@Injectable({
  providedIn: 'root'
})

export class ShareDataService {
  private behave = new BehaviorSubject<any[]>([]); 
  isLoggedIn: Observable<boolean>;
  constructor(public restApi: ApiServiceService,private httpClient:HttpClient) { }
  keyword:string;
  country:string;
  area:string;
  private customSubject = new Subject<any>();
  customObservable = this.customSubject.asObservable();
  callComponentMethod(value:any) {
    this.customSubject.next(value);
  }
  getMessage(): Observable<any> {
    return this.behave.asObservable();
  }
  sendMessage(profile: any) {
    this.behave.next(profile);
  }
  canActivate(){
    this.restApi.loginTest(true);
    this.isLoggedIn = this.restApi.isLoggedIn();
    if (this.isLoggedIn){
        // alert('LogUser');
        return true;
    }else{
      // alert('not logion');
      return false;
    }
  }
  
}
