import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(public restApi: ApiServiceService) { }
  logoLang:any='assets/image/logo_en.png';
  ngOnInit(): void {
    this.restApi.getLanguage().subscribe((response) => {
      if(this.restApi.lang_code=='en'){
        this.logoLang='assets/image/logo_en.png';
      }else{
        this.logoLang='assets/image/logo_ar.png';
      }
    });
  }

}
