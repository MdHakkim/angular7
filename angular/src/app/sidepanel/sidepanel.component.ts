import { Component, Input, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit(): void {
  }

}
