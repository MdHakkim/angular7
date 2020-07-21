import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
@Component({
  selector: 'app-vision-mission',
  templateUrl: './vision-mission.component.html',
  styleUrls: ['./vision-mission.component.css']
})
export class VisionMissionComponent implements OnInit {

  constructor(public restApi: ApiServiceService) { }
  errorMessage:string;
  name:any;
  paragraph:any;
  ngOnInit(): void {
    // this.errorMessage = "";
    // this.restApi.footerPage(4).subscribe((response) => {
    //   this.name = response[0].pg_name;
    //   this.paragraph = response[0].pg_desc;
    //   console.log(response,"test");
    // },
    // (error) => {
    //   console.error('Request failed with error')
    //   this.errorMessage = error;
    // }
    // )
    this.generateFunction();
    this.restApi.getLanguage().subscribe((response) => {
      this.generateFunction();
    });
  }

  generateFunction(){
    this.errorMessage = "";
    this.restApi.footerPage(4).subscribe((response) => {
      this.name = response[0].pg_name;
      if(this.restApi.lang_code=='en'){
        this.paragraph = response[0].pg_desc;
      }else{
        this.paragraph = response[0].pg_flex_01;
      }
      console.log(response,"test");
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
    }
    )
  }
}
