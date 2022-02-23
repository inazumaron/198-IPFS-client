import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-en-down-popup',
  templateUrl: './en-down-popup.component.html',
  styleUrls: ['./en-down-popup.component.css']
})
export class EnDownPopupComponent implements OnInit {

  skip: boolean = false;
  passcode: string="";

  constructor() { }

  ngOnInit() {
  }

}
