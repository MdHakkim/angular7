import { Component, OnInit,OnDestroy,ElementRef  } from '@angular/core'
import { ApiServiceService } from '../api-service.service';
import { ShareDataService } from '../share-data.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
declare var $:any;

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  srcImage ="/assets/image/bgimg.jpg";
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
  geoLocation:any;
  showPdf:any;
  // oneTimeCall:boolean=false;
  // geoLocationStart:boolean=false;
  constructor(public restApi: ApiServiceService,private sharedata:ShareDataService,private _elementRef : ElementRef,private sanitizer: DomSanitizer) { 
    this.restApi.getLanguage().subscribe((response) => {
      this.searchCountry();
      this.getArea(event, 'A');
      this.busiContent();
      this.indiviContent();
    });
  }
  ngOnInit(): void {
    this.errorMessage = "";
    const geoLocation = localStorage.getItem("geoLocation");
    if(geoLocation==null){
      this.restApi.geoLocation().subscribe((response) => {
        let countryDefult = response.result.country_code;
        this.country= Number(countryDefult);
        localStorage.setItem('geoLocation', countryDefult);
      },
      (error) => {
        console.error('Request failed with error');
        this.errorMessage = error;
      });
    }
    this.busiContent();
    this.indiviContent();
    this.searchCountry().then(() => {
      this.geoLocation = localStorage.getItem("geoLocation");
      this.country = Number(this.geoLocation);
      this.getArea(event, 'A');
    });
  }
  ngAfterViewInit() {
    
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
  getModel(params){
    console.log(params,"stest");
    this.showPdf=this.sanitizer.bypassSecurityTrustResourceUrl(<string>params);
  }
  searchClick(event,param){
    this.passArray = [];
    this.passArray.push(param);
    this.passArray.push(this.profession);
    this.passArray.push(this.country);
    this.passArray.push(this.area);
    this.sharedata.sendMessage(this.passArray);
  }

  getArea(event,param){
    let cntyCode= this.country;
    let areadesc = (param=='A' ? '' :event.target.value);
    this.restApi.getArea(cntyCode,areadesc).subscribe((response) => {
      this.area=null;
      this.arealist = response.result;
    },(err) => console.error(err),()=>{
      
    })
  }

  routeparam(params){
    this.sharedata.sendMessage(params);
  }

  searchCountry(){
    this.errorMessage = "";
    return new Promise((resolve, reject) => {        
      this.restApi.get_country_Request().subscribe((response) => {
        this.countrylist = response;
        resolve();
      },
      (error) => {
        console.error('Request failed with error')
        this.errorMessage = error;
        this.loading = false;
      })
    });
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
