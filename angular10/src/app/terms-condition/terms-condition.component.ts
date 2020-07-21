import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.component.html',
  styleUrls: ['./terms-condition.component.css']
})
export class TermsConditionComponent implements OnInit {

  constructor(public restApi: ApiServiceService) { }
  errorMessage:string;
  name:any;
  paragraph:any;
  ngOnInit(): void {
    this.generateFunction();
    this.restApi.getLanguage().subscribe((response) => {
      this.generateFunction();
    });
  }

  generateFunction(){
    this.errorMessage = "";
    this.restApi.footerPage(2).subscribe((response) => {
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
