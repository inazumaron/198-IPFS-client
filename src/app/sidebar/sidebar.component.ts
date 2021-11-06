import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  plusMinus = "+";

  constructor() { }

  ngOnInit() {
  }

  toggleBtn() {
    if (this.plusMinus == "+")
      this.plusMinus = "-";
    else
      this.plusMinus = "+";
  }
}
