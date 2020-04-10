import { Injectable } from '@angular/core';
import { HttpClient, HttpParams,HttpHeaders,HttpErrorResponse  } from '@angular/common/http';
import { Employee } from './shared/employee';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private httpClient: HttpClient) { }
  api_busi_URL = 'http://api.shrekat.com/api/premium_home?country=1&category=COMPANY';
  api_indi_URL = 'http://api.shrekat.com/api/premium_home?country=1&category=INDIVIDUAL';
  // api_search_URL = 'http://api.shrekat.com/api/advance_search?country=1&keyword=&area=&category=';
  api_country_URL = 'http://api.shrekat.com/api/country/all';
  api_area_URL = 'http://api.shrekat.com/api/all_area_in_country?id=1&search=';
  api_search_URL = 'http://api.shrekat.com/api/advance_search?country=';
  api_service_URL = 'http://api.shrekat.com/api/master_services/all';
  get_business_Request(): Observable<any>{
    return this.httpClient.get(this.api_busi_URL).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_individual_Request(): Observable<any>{
    return this.httpClient.get(this.api_indi_URL).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_search_Request(): Observable<any>{
    return this.httpClient.get(this.api_search_URL).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_country_Request(): Observable<any>{
    return this.httpClient.get(this.api_country_URL).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_area_Request(): Observable<any>{
    return this.httpClient.get(this.api_area_URL).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_service_Request(): Observable<any>{
    return this.httpClient.get(this.api_service_URL).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  fetch_search_Request(keyword,countrylov,category): Observable<any>{
    return this.httpClient.get(this.api_search_URL+countrylov+'&keyword='+keyword+'&area=&category='+category).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }

  fetch_advancesearch_Request(keyword,serviceAdv,countryAdv,areaAdv,categoryAdv,genderAdv): Observable<any>{
    return this.httpClient.get(this.api_search_URL+countryAdv+'&keyword='+keyword+'&area='+areaAdv+'&category='+categoryAdv+'&service='+serviceAdv).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }

  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      
      errorMessage = error.error.message;
    } else {
      
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }
}
