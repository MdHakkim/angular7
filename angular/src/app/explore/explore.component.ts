import { Component, OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ShareDataService } from '../share-data.service';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent implements OnInit {
  errorMessage;
  loading: boolean = false;
  searchData : (string | number)[];  
  country : string[]; 
  passArray: any;
  Keyword : string="";
  countrylov : string;
  area : string;
  category : string;
  service : string;
  serviceAdv : string="";
  countryAdv : any="";
  areaAdv : string="";
  categoryAdv : any="";
  genderAdv : string="";
  language:string;
  noneAdv:string;
  onlineYN:string="N";
  profileYN:string="N";
  private subscription :Subscription;
  private subscrib :Subscription;
  flag:string;
  constructor(private restApi: ApiServiceService,private sharedata:ShareDataService,private route: ActivatedRoute, private router: Router) {
    
   }
  
   async ngOnInit(){
    await this.searchCountry();
    // this.searchContent();
    // this.searchArea();
    await this.searchService();
    this.category="0";
    this.subscription = await this.sharedata.getMessage().subscribe(
    (data) =>{ 
      if(data.length>0){
        console.log(data,"testing me");
          this.flag = data[0];
          this.Keyword = data[1];
          this.countrylov = data[2];
          this.countryAdv = data[2];
          this.getArea(this.countryAdv);
          this.areaAdv = data[3];
          if(this.flag=='S'){
            document.getElementById('searchButton').click();
          }else{
            document.getElementById('advanceSeach').click();
          }
      }else{
        this.countrylov='0';
        this.countryAdv='0';
      }
      },error => {
        console.log("EE:",error);
      });    
  }

  searchCountry(){
    this.errorMessage = "";
    this.restApi.get_country_Request().subscribe((response) => {
      this.country = response;
      this.countryAdv='0';
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }
  
  searchService(){
    this.errorMessage = "";
    this.restApi.get_service_Request().subscribe((response) => {
      this.service = response;
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }
  searchContent(){
    this.errorMessage = "";
    this.restApi.get_search_Request().subscribe((response) => {
      this.searchData = response.result;
      console.log(response,"google");
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }

  servicelist(id){
    this.errorMessage = "";
    this.subscription.unsubscribe();
    alert(id);
    
    let returnlists = [];
    this.subscrib=this.restApi.get_servicelist_Request(id).subscribe((response) => {
      
      returnlists= response.result;
      console.log(returnlists,"returnlists");
      this.subscrib.unsubscribe();
    },
    (error) => {
      console.error('Request failed with error')
      this.errorMessage = error;
      this.loading = false;
    }, () => this.subscrib.unsubscribe()
    )
    // this.subscrib.unsubscribe();  
    return returnlists;
  }

  searchInformation(){
    let category = this.category;
    if(category=='0'){
      category = "";
    }
    this.errorMessage = "";
    this.subscription = this.restApi.fetch_search_Request(this.Keyword,this.countrylov,category).subscribe((response) => {
      this.searchData = response.result;
      console.log(response,"google");
    })
  }

  advanceSearch(){
    console.log(this.Keyword,"keyowrd");
    this.errorMessage = "";
    this.restApi.fetch_advancesearch_Request(this.countryAdv,this.Keyword,this.serviceAdv,this.areaAdv,this.categoryAdv,this.genderAdv,this.onlineYN,this.profileYN).subscribe((response) => {
      this.searchData = response.result;
      console.log(response,"google");
    })
  }

  getArea(value){
    let cntyCode= value;
    let keyword= this.Keyword;
    this.restApi.getArea(cntyCode,keyword).subscribe((response) => {
      this.area = response.result;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
