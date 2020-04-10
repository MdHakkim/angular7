import { Injectable } from '@angular/core';
import { Observable,Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  // private messageSource = new BehaviorSubject('default message');
  // currentMessage = this.messageSource.asObservable();
  constructor() { }
  // changeMessage(message: string) {
  //   this.messageSource.next(message)
  // }
  myMethod: Observable<any>;
  private subject = new Subject<any>();
  sendMessage(message: string) {
    this.subject.next({ text: message });
  }
  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
