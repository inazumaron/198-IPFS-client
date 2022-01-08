import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { NzNotificationService } from "ng-zorro-antd";
import { Router } from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: "app-receive",
  templateUrl: "./receive.component.html",
  styleUrls: ["./receive.component.css"],
})
export class ReceiveComponent implements OnInit {
  isLoading: boolean = false;
  CID: string = "";
  passCode: string = "";
  proceed: boolean = false;

  constructor(
    private api: ApiService,
    private notification: NzNotificationService,
    private route: Router,
    private _location: Location
  ) {}

  ngOnInit() {}

  back() {
    this._location.back();
  }

  async createFileFromCID() {
    this.isLoading = true;
    try {
      console.log(this.api.decrypt(this.CID, this.CID, this.passCode));
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    while (this.api.decrypt_loading) {
      await new Promise((f) => setTimeout(f, 100));
    }
    if (this.api.decryptError()) {
      this.notification.error("Failed", "Invalid passcode");
    } else {
      this.isLoading = false;
      this.route.navigate(["/received"]);
    }
  }
}
