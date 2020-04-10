import { Component, OnInit } from '@angular/core'
import { ApiServiceService } from '../api-service.service';
import { ShareDataService } from '../share-data.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  srcImage ="assets/image/bgimg.jpg";
  errorMessage;
  loading: boolean = false;
  business : (string | number)[];  
  individual : (string | number)[];  
  passArray: any = [];
  message:string;
  profession :string;
  country :string;
  area :string;
  constructor(public restApi: ApiServiceService,private sharedata:ShareDataService) { }
  ngOnInit(): void {
    this.busiContent();
    this.indiviContent();
    // this.sharedata.currentMessage.subscribe(message => this.message = message);
    console.log(this.message,"share data");
  }

  busiContent(){
    this.errorMessage = "";
    this.restApi.get_business_Request().subscribe((response) => {
      this.business = response.result;
      console.log(response,"Test");
    },
    (error) => {
      console.error('Request failed with error throw in console')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }

  public indiviContent(){
    this.restApi.get_business_Request().subscribe((response) => {
      this.individual = response.result;
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }

  searchClick(){
    this.passArray.push(this.profession);
    this.passArray.push(this.country);
    this.passArray.push(this.area);
    this.sharedata.sendMessage(this.passArray);
    console.log(this.passArray);
  }
  setColors(){
      var style = {
        "backgroung":"lime",
        "width":"100px",
        "height":"100px"
      }
    return style;
  }

}
