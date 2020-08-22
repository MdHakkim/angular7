import { Component, Input, OnInit,Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
export interface Post {
  title:string;
  content:string;
}
@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.css']
})
export class SidepanelComponent implements OnInit {
  @Input() isbShown;
  @Input() isiShown;
  @Input() CaptionName;
  @Input() businessProf;
  imageSizeVali:boolean = false;
  imageValidSize: boolean = false;
  imageValidFormat: boolean =  false;
  pdfSizeVali: boolean = false;
  pdfValidSize: boolean = false;
  pdfValidFormat: boolean = false;
  fileData: File = null;
  LogoUrl:any = '/assets/image/bg.png';
  previewUrl_P_I:any = '/assets/image/bg.png';
  previewUrl:any = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/image/bg.png');
  previewUrl_L_I:any = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/image/bg.png');
  fileUploadProgress: string = null;
  uploadedFilePath: string = null;
  emitt : any ='';
  constructor(private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {
  }
  @Output() imageBaseurl = new EventEmitter<Post>();
  fileProgress(fileInput: any,params) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview(params);
  }
  restImage(param){
    if(param=='B'){
      this.validation('LB', false, null);
      this.LogoUrl = '/assets/image/bg.png';
      this.previewUrl= this.sanitizer.bypassSecurityTrustResourceUrl('/assets/image/bg.png');
    }else{
      this.validation('PI', false, null);
      this.previewUrl_P_I = '/assets/image/bg.png';
      this.previewUrl_L_I = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/image/bg.png');
    }
  }
  preview(params) {
    this.validation(params,false,null);
    var mimeType = this.fileData.type;
    // console.log('size', this.fileData.size);
    let fileSize = this.fileData.size;
    // /image\/*/ all image
    if(params=='LB' || params=='LI'){
      if (fileSize > 2000000) {
        this.validation(params, true, 'S');
        return false;
      }
      if (mimeType.match(/image\/*/) == null) {
        this.validation(params,true,'F');
        return;
      }
    }else{
      if (fileSize > 3000000) {
        this.validation(params, true, 'S');
        return false;
      }
      if (mimeType.match('application/pdf') == null) {
        this.validation(params, true, 'F');
        return;
      }
    }
 
    var reader = new FileReader();      
    reader.readAsDataURL(this.fileData); 
    reader.onload = (_event) => {
      console.log(reader.result,"AKKIM INN");
      this.emitt = reader.result;
      let savParamters : Post;
      if(params=='LB'){
        this.LogoUrl = reader.result;
        savParamters = {title: 'Logo', content: this.emitt};
      }else if(params=='PB'){
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(<string>reader.result);
        console.log(this.previewUrl,"INNER INN");
        savParamters = {title: 'Profile', content: this.emitt};
      }else if(params=='PI'){
        this.previewUrl_L_I = this.sanitizer.bypassSecurityTrustResourceUrl(<string>reader.result);
        savParamters = {title: 'Profile_i', content: this.emitt};
      }else if(params=='LI'){
        this.previewUrl_P_I = reader.result; 
        savParamters = { title: 'Logo_i', content: this.emitt};
      }
      this.imageBaseurl.emit(savParamters);
    }
  }

  validation(mode,params,type){
    if (mode == 'LB' || mode == 'LI'){
      this.imageSizeVali = params;
      if(type=='S')
        this.imageValidSize = params;
      else if(type=='F'){
        this.imageValidFormat = params;
      }else{
        this.imageValidSize = params;
        this.imageValidFormat = params;
      }
    }else{
      this.pdfSizeVali = params;
      if (type == 'S')
        this.pdfValidSize = params;
      else if (type == 'F') {
        this.pdfValidFormat = params;
      } else {
        this.pdfValidSize = params;
        this.pdfValidFormat = params;
      }
    }
  }

}
