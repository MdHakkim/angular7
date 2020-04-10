import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../api-service.service';
import { ShareDataService } from '../share-data.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  passArray: any = [];
  Keyword : string="";
  countrylov : string;
  category : string;
  constructor(private restApi: ApiServiceService,private sharedata:ShareDataService,private route: ActivatedRoute, private router: Router) {
    
   }

  ngOnInit(){
    this.searchCountry();
    this.searchContent();
      this.sharedata.getMessage().subscribe((data) => {
        this.passArray = data;
        console.log(data,"servicess");
      });
    console.log(this.passArray,"this.getArray");
  }

  searchCountry(){
    this.errorMessage = "";
    this.restApi.get_country_Request().subscribe((response) => {
      this.country = response;
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

  searchInformation(){
    console.log(this.Keyword,"keyowrd");
    this.errorMessage = "";
    this.restApi.fetch_search_Request(this.Keyword,this.countrylov,this.category).subscribe((response) => {
      this.searchData = response.result;
      console.log(response,"google");
    })
  }
}
