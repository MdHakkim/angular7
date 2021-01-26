import { Component, HostListener  } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // @HostListener("beforeunload", ["$event"])
  // clearLocalStorage(event) {
  //   localStorage.clear();
  // }
  // window.localStorage.removeItem('keyName');
  constructor(private titleService: Title) {
  }
}

