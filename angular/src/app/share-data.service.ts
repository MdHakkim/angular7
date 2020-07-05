import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams,HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  private behave = new BehaviorSubject<any[]>([]); 
  constructor(private httpClient:HttpClient) { }
  keyword:string;
  country:string;
  area:string;
  private customSubject = new Subject<any>();
  customObservable = this.customSubject.asObservable();
  callComponentMethod(value:any) {
    this.customSubject.next(value);
  }
  // private subject = new Subject<any>();
  // message$ = this.subject.asObservable();
  // getMessage(): Observable<any> {
  //   return this.subject.asObservable();
  //   // console.log(this.subject,"SHARING");
  // }
  // sendMessage(message: string){
  //   this.subject.next({ msg: message });
  //   // console.log(this.subject,"SHARING 2");
  // }
  // close() {
  //   this.subject.complete();
  // }
  getMessage(): Observable<any> {
    return this.behave.asObservable();
  }

  sendMessage(profile: any) {
    this.behave.next(profile);
  }
  
  
}
