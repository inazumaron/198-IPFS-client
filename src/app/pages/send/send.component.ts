import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import { Entry } from "src/app/services/api.service";

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css']
})
export class SendComponent implements OnInit {
  passcode: string = "";
  canUpload = false;
  debugVar = 0;

  data: Entry[] = [];
  levels: string[] = [];
  directory: string = "";
  isDirectory = false;
  isLoading = false;
  private isProcessed: boolean = false;
  directoryData = {
    directory: "/uploads",
    passphrase: ""
  };

  constructor(
    private notification: NzNotificationService,
    private route:Router,
    private _location: Location
  ) { }

  ngOnInit() {
  }

  back() {
    this._location.back();
  }

  checkPass = () => {
    this.debugVar += 1;
    if (this.passcode.length >= 15){
      this.canUpload = true;
      this.directoryData.passphrase = this.passcode;
    }
    else
      this.canUpload = false;
  }

  beforeUpload = (file: any) => {
    if (this.isDirectory && !this.isProcessed) {
      const filename = file.webkitRelativePath;
      const directory_name = filename.split("/")[0];
      if (this.directory == "/")
        this.directoryData.directory = `/${directory_name}`;
      else this.directoryData.directory = `${this.directory}/${directory_name}`;
      this.isProcessed = true;
    }
  };

  handleChange(info: { file: any; fileList: any[] }): void {
    switch (info.file.status) {
      case "uploading":
        this.isLoading = true;
        break;
      case "done":
        this.isLoading = false;
        this.notification.success("Success", "File successfully uploaded");
        this.route.navigate(['/sent',{cid:info.file.response.cid, pc:this.passcode}]);
        break;
      case "error":
        try {
          this.notification.error(
            "Upload Failed",
            info.file.error.error.message[0]
          );
        } catch (err) {
          console.error(info.file.error);
          this.notification.error("Upload Failed", "Something went wrong");
        }
        this.isLoading = false;
        break;
    }
  }

}
