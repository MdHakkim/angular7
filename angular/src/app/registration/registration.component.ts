import { Component, ViewChild, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
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
  // @ViewChild(SidepanelComponent, { static: false }) sidepanel: SidepanelComponent;
  constructor(public restApi: ApiServiceService) {
    // this.loadEmployee();
   }
  ngOnInit(): void {
    // this.loadEmployee();
  }
  // loadEmployee(){
  //    this.restApi.getRequest().subscribe((data) => {
  //     console.log(data,"hakkim testing");
  //     alert();
  //   })
  // }
  sideBarToggle(event,param){
    if(param=="B"){
      this.CaptionName = "Business Logo";
      this.bCaptionName= "Business Profile";
      this.isiShown=false;
      this.isbShown = true;
    }else{
      this.CaptionName = "Individual Photo";
      this.isbShown = false;
      this.isiShown = true;
    }
  }
}
