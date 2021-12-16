import { Component, OnInit } from '@angular/core';
import { ApiService } from "src/app/services/api.service";
import { NzNotificationService } from "ng-zorro-antd";
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.css']
})
export class ReceiveComponent implements OnInit {

  isLoading: boolean = false;
  CID: string = "";
  passCode: string = "";

  constructor(
    private api: ApiService,
    private notification: NzNotificationService,
    private route:Router,
    private _location: Location
    ) { }

  ngOnInit(){
  }

  back() {
    this._location.back();
  }

  private async createFileFromCID() {
    this.isLoading = true;
    try {
      this.api.decrypt(this.CID, this.CID, this.passCode);
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    this.isLoading = false;
    this.route.navigate(['/received']);
  }

}
