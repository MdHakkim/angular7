import { Component, OnInit,OnDestroy  } from '@angular/core'
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
  message:any;
  profession :string="";
  country :any;
  countrylist :any;
  area :any;
  arealist :any;
  constructor(public restApi: ApiServiceService,private sharedata:ShareDataService) { }
  ngOnInit(): void {
    this.busiContent();
    this.indiviContent();
    this.searchCountry();
    this.country=0;
    this.area=0;
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
    this.restApi.get_individual_Request().subscribe((response) => {
      this.individual = response.result;
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }

  searchClick(event,param){
    this.passArray = [];
    this.passArray.push(param);
    this.passArray.push(this.profession);
    this.passArray.push(this.country);
    this.passArray.push(this.area);
    this.sharedata.sendMessage(this.passArray);
    // console.log(this.passArray);
    // this.sharedata.keyword=this.profession;
    // this.sharedata.country=this.country;
    // this.sharedata.area=this.area;
  }

  routeparam(params){
    this.sharedata.sendMessage(params);
  }

  searchCountry(){
    this.errorMessage = "";
    this.restApi.get_country_Request().subscribe((response) => {
      this.countrylist = response;
      console.log(response,"test");
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }

  setColors(){
      var style = {
        "backgroung":"lime",
        "width":"100px",
        "height":"100px"
      }
    return style;
  }

  getArea(value){
    let cntyCode= value;
    let keyword= this.profession;
    this.restApi.getArea(cntyCode,keyword).subscribe((response) => {
      this.arealist = response.result;
    })
    this.area=0;
  }
}
