import { Component, OnInit,OnDestroy,ElementRef  } from '@angular/core'
import { ApiServiceService } from '../api-service.service';
import { ShareDataService } from '../share-data.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { Router, NavigationStart } from '@angular/router';

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
  sessionLogin:boolean=true;
  paragraphShow:boolean=false;
  paragraphShowI:boolean=false;
  moreDots:any = '...more';
  moreDotsI:any = '...more';
  // oneTimeCall:boolean=false;
  // geoLocationStart:boolean=false;
  constructor(public router: Router,public restApi: ApiServiceService,private sharedata:ShareDataService,private _elementRef : ElementRef,private sanitizer: DomSanitizer) { 
    this.restApi.getLanguage().subscribe((response) => {
      this.searchCountry();
      this.getArea(event, 'A');
      this.busiContent();
      this.indiviContent();
    });
    const getSecure = JSON.parse(sessionStorage.getItem("secure"));
    if(getSecure){
      this.sessionLogin=false;
    }
  }
  ngOnInit(): void {
    this.errorMessage = "";
    const geoLocation = sessionStorage.getItem("geoLocation");
    if(geoLocation==null){
      this.restApi.geoLocation().subscribe((response) => {
        let countryDefult = response.result.country_code;
        this.country= Number(countryDefult);
        sessionStorage.setItem('geoLocation', countryDefult);
      },
      (error) => {
        console.error('Request failed with error');
        this.errorMessage = error;
      });
    }
    this.searchCountry().then(() => {
      this.geoLocation = sessionStorage.getItem("geoLocation");
      this.country = Number(this.geoLocation);
      this.getArea(event, 'A');
      this.busiContent();
      this.indiviContent();
    });
    // this.loadExternalScript('https://apps.elfsight.com/p/platform.js');
  }
  ngAfterViewInit() {
    
  }
  bnotEmptyRecord: boolean;
  busiContent(){
    this.errorMessage = "";
    let countryCode = this.country;
    this.restApi.get_business_Request(countryCode).subscribe((response) => {
      if (response.result.length > 0) {
        this.bnotEmptyRecord = true;
        this.business = response.result;
      } else {
        this.bnotEmptyRecord = false;
        this.business = ["noFound"];
      }
    },
    (error) => {
      console.error('Request failed with error throw in console')
      this.errorMessage = error;
      this.loading = false;
    }
    )
  }
  // public loadExternalScript(url: string) {
  //   const body = <HTMLDivElement>document.body;
  //   const script = document.createElement('script');
  //   script.innerHTML = '';
  //   script.src = url;
  //   script.async = true;
  //   script.defer = true;
  //   body.appendChild(script);
  // }
  notEmptyRecord:boolean;
  public indiviContent(){
    let countryCode = this.country;
    this.restApi.get_individual_Request(countryCode).subscribe((response) => {
      if (response.result.length>0){
        this.notEmptyRecord=true;
        this.individual = response.result;
      }else{
        this.notEmptyRecord = false;
        this.individual = ["noFound"];
      }
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
  searchClick(event,param,entr){
    this.passArray = [];
    this.passArray.push(param);
    this.passArray.push(this.profession);
    this.passArray.push(this.country);
    this.passArray.push(this.area);
    this.sharedata.sendMessage(this.passArray);
    if (entr =='ENT'){
      this.router.navigate(['/explore']);
    }
  }

  getArea(event,param){
    let cntyCode= this.country;
    let areadesc = (param=='A' ? '' :event.target.value);
    this.restApi.getArea(cntyCode,areadesc).subscribe((response) => {
      this.area=null;
      this.arealist = response.result;
      this.busiContent();
      this.indiviContent();
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
  actionPart(indx,param,data){
    if (param=='B'){
      data.paragraphShow = !data.paragraphShow;
      if (data.paragraphShow){
        data.moreDots=false;
      }else{
        data.moreDots = true;
        const getClass = document.getElementsByClassName('uniqueClass' + indx)[0];
        getClass.scrollTop = 0;
      }
    }else{
      data.paragraphShowI = !data.paragraphShowI;
      if (data.paragraphShowI) {
        data.moreDotsI = false;
      }else{
        data.moreDotsI = true;
        const getClass = document.getElementsByClassName('uniqueClassI' + indx)[0];
        getClass.scrollTop = 0;
      }
    }
  }

}
