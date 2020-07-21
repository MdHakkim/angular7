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
  @Input() isiShown;
  @Input() isbShown;
  @Input() CaptionName;
  @Input() businessProf;

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
    // let tsting='http://www.pdf995.com/samples/pdf.pdf';
    // this.LogoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(tsting);
    // this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/image/bg.png');
  }
  @Output() imageBaseurl = new EventEmitter<Post>();
  fileProgress(fileInput: any,params) {
    this.fileData = <File>fileInput.target.files[0];
    this.preview(params);
  }
  preview(params) {
    // Show preview 
    var mimeType = this.fileData.type;
    console.log('size', this.fileData.size);
    let fileSize = this.fileData.size;
    if(fileSize>2000000){
      return false;
    }
    // /image\/*/ all image
    if(params=='LB' || params=='LI'){
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
    }else{
      if (mimeType.match('application/pdf') == null) {
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
        savParamters = {title: 'Profile', content: this.emitt};
      }else if(params=='LI'){
        this.previewUrl_P_I = reader.result; 
        savParamters = {title: 'I_Profile', content: this.emitt};
      }
      this.imageBaseurl.emit(savParamters);
    }
  }

}
