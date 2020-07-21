import { Component, OnInit,OnDestroy,ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from '../api-service.service';
import { ShareDataService } from '../share-data.service';
import { Subscription } from "rxjs";
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
declare var $:any;
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
  countrylov : any;
  area : string;
  category : string;
  service : string;
  serviceAdv : string;
  countryAdv : any;
  areaAdv : string;
  categoryAdv : any;
  genderAdv : string;
  language:string;
  noneAdv:string;
  onlineYN:string="N";
  profileYN:string="N";
  private subscription :Subscription;
  private subscrib :Subscription;
  flag:string;
  orderby:string;
  showpost:string;  
  showPdf:any;
  geoLocation = localStorage.getItem("geoLocation");
  constructor(private restApi: ApiServiceService,private sharedata:ShareDataService,private route: ActivatedRoute, private router: Router,private _elementRef : ElementRef,private sanitizer: DomSanitizer) {
    
   }
  
   async ngOnInit(){
    this.orderby="";
    this.showpost="";
    // this.searchService('');
    this.searchCountry().then(()=>{
    this.subscription=this.sharedata.getMessage().subscribe(
    (data) =>{ 
      if(data.length>0){
        console.log(data,"Innser me");
          this.flag = data[0];
          this.Keyword = data[1];
          this.countrylov = data[2];
          this.countryAdv = data[2];
          this.getArea(this.countryAdv,'AS');
          setTimeout(() => {
            this.areaAdv = data[3];
          },100);
          if(this.flag=='S'){
            document.getElementById('searchButton').click();
          }else{
            document.getElementById('advanceSeach').click();
          }
      }else{
        this.countrylov=Number(this.geoLocation);
        this.countryAdv=Number(this.geoLocation);
        this.getArea(event,'A');
      }
      },error => {
        console.log("EE:",error);
      });
    });
    // this.restApi.getLanguage().subscribe((response) => {
    //   this.searchService();
    // });
  }
  ngAfterViewInit() {
    
  }

  searchCountry(){
    this.errorMessage = "";
      return new Promise((resolve, reject) => {        
        this.restApi.get_country_Request().subscribe((response) => {
          this.country = response;
          resolve();
        },
        (error) => {
          console.error('Request failed with error')
          this.errorMessage = error;
          this.loading = false;
        }
      );
    });
  }
  
  searchService(event){
    this.errorMessage = ""; 
    let desc = event.target.value;
    this.restApi.get_service_lov_Request(desc).subscribe((response) => {
      console.log(response);
      this.service = response.result;
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
    return returnlists;
  }

  // searchInformation(){
  //   let category = this.category;
  //   let keyword = this.Keyword;
  //   console.log(category,"CHECK DEINFE");
  //   if(category==undefined){
  //     category = "";
  //   }
  //   this.errorMessage = "";
  //   this.subscription = this.restApi.fetch_search_Request(this.countrylov,this.Keyword,category).subscribe((response) => {
  //     this.searchData = response.result;
  //     console.log(response,"google");
  //   })
  // }

  advanceSearch(param=''){
    this.errorMessage = "";
    let category = this.category;
    let gender = this.genderAdv;
    let service = this.serviceAdv;
    if(param==''){
      var country = this.countryAdv;
    }else{
      var country = this.countrylov;
    }
    if(category==undefined){
      category = "";
    }
    if(gender==undefined){
      gender = "";
    }
    if(service==undefined){
      service = "";
    }
    let area = (this.areaAdv==null? '' : this.areaAdv)
    this.restApi.fetch_advancesearch_Request(country,this.Keyword,service,area,category,gender,this.onlineYN,this.profileYN,this.orderby,this.showpost).subscribe((response) => {
      this.searchData = response.result;
      console.log(response,"google");
    })
  }

  categoryChange(){
    this.category=this.category;
  }
  restArea(){
    this.areaAdv=null;
    let cntyCode= this.countrylov;
    this.countryAdv=cntyCode;
    this.restApi.getArea(cntyCode,'').subscribe((response) => {
      this.area = response.result;
    });
  }
  getArea(event,param){
    let cntyCode= this.countryAdv;
    this.countrylov=cntyCode;
    this.areaAdv=null;
    let areadesc = ((param=='A' || param=='AS')  ? '' :event.target.value);
    this.restApi.getArea(cntyCode,areadesc).subscribe((response) => {
      this.area = response.result;
    },(err) => console.error(err),()=>{
     
    })
  }
  getModel(params){
    console.log(params,"stest");
    this.showPdf=this.sanitizer.bypassSecurityTrustResourceUrl(<string>params);
  }
  changeArea(){
    this.areaAdv=this.areaAdv;
  }
  advanceClick(){
      
  }
  acitveClass=true;
  acitveSplit=false;
  gridView($param){
    if($param=='SP'){
      this.acitveSplit=true;
      this.acitveClass=false;
    }else{
      this.acitveClass=true;
      this.acitveSplit=false;
    }
    
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
