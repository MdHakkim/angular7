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
  api_country_URL = 'http://api.shrekat.com/api/country/all';
  api_city_URL = 'http://api.shrekat.com/api/all_city_in_country?id=';
  api_search_URL = 'http://api.shrekat.com/api/advance_search?country=';
  api_service_URL = 'http://api.shrekat.com/api/master_services/all';
  api_area_URL = 'http://api.shrekat.com/api/all_area_in_country?id=';
  api_register_URL = 'http://api.shrekat.com/api/registration/add';
  api_busi_type_URL = 'http://api.shrekat.com/api/business_types?business_type=';
  api_service_lov_URL = 'http://api.shrekat.com/api/service_list?search=';
  api_subscription_URL = 'http://api.shrekat.com/api/subscription_list?id=';
  api_servicelist_URL = 'http://api.shrekat.com/api/available_service?id=';
  api_area_lov_URL = 'http://api.shrekat.com/api/all_area_in_city?id=';
  api_login_URL = 'http://api.shrekat.com/api/login/verify';
  api_editprofile_URL = 'http://api.shrekat.com/api/portal/edit_profile?email=';
  api_updateprofile_URL = 'http://api.shrekat.com/api/portal/update_profile';
  api_contact_URL = 'http://api.shrekat.com/api/from_website_contact';
  api_footerPage_URL = 'http://api.shrekat.com/api/page/';
  api_geoLocation_URL = 'http://api.shrekat.com/api/geo_info';
  headers = new HttpHeaders({
    'Content-Type': 'application/json' });
  options = { headers: this.headers };
  login(logindata): Observable<any>{
    return this.httpClient.post<any>(this.api_login_URL,logindata,this.options).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  updateProfile(logindata): Observable<any>{
    return this.httpClient.post<any>(this.api_updateprofile_URL,logindata,this.options).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  contactForm(contactform): Observable<any>{
    return this.httpClient.post<any>(this.api_contact_URL,contactform,this.options).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  geoLocation(): Observable<any>{
    return this.httpClient.get(this.api_geoLocation_URL).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  footerPage(params): Observable<any>{
    return this.httpClient.get(this.api_footerPage_URL+params).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  fetch_editProfile(email,token): Observable<any>{
    return this.httpClient.get(this.api_editprofile_URL+email+'&token='+token).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  submitRegistration(formData): Observable<any>{
    // console.log(formData,"amhere");
    return this.httpClient.post<any>(this.api_register_URL,formData,this.options).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
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
  get_city_Request(country,citydesc): Observable<any>{
    return this.httpClient.get(this.api_city_URL+country+'&search='+citydesc).
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
  fetch_search_Request(countrylov,keyword,category): Observable<any>{
    return this.httpClient.get(this.api_search_URL+countrylov+'&keyword='+keyword+'&area=&category='+category).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }

  fetch_advancesearch_Request(countryAdv,keyword,serviceAdv,areaAdv,categoryAdv,genderAdv,onlineYN,profileYN,orderby,showpost): Observable<any>{
    return this.httpClient.get(this.api_search_URL+countryAdv+'&keyword='+keyword+'&service='+serviceAdv+'&area='+areaAdv+'&category='+categoryAdv+'&gender='+genderAdv+'&online_appoint_yn='+onlineYN+'&_image='+profileYN+'&order_by='+orderby+'&show_post='+showpost).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  getArea(cntyCode,desc): Observable<any>{
    return this.httpClient.get(this.api_area_URL+cntyCode+'&search='+desc).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }

  get_area_Request(cntyCode,desc): Observable<any>{
    return this.httpClient.get(this.api_area_lov_URL+cntyCode+'&search='+desc).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_business_type_Request(defalut,desc): Observable<any>{
    return this.httpClient.get(this.api_busi_type_URL+defalut+'&search='+desc).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_service_lov_Request(desc): Observable<any>{
    return this.httpClient.get(this.api_service_lov_URL+desc).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_subscription_Request(country,defaults): Observable<any>{
    return this.httpClient.get(this.api_subscription_URL+country+'&business_type='+defaults).
    pipe(
      retry(1),catchError(this.handleError)
    )
  }
  get_servicelist_Request(id): Observable<any>{
    return this.httpClient.get(this.api_servicelist_URL+id).
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
    console.log(errorMessage);
    return throwError(errorMessage);
 }
}
