import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  data = ["File A","File B","File C","File D","File E"];

  constructor() { }

  ngOnInit() {
  }

}
