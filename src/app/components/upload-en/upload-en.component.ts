import { Component, OnInit, Input } from '@angular/core';
import { NzModalRef, NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: 'app-upload-en',
  templateUrl: './upload-en.component.html',
  styleUrls: ['./upload-en.component.css']
})
export class UploadEnComponent implements OnInit {

  @Input() directory: string = "";
  @Input() isDirectory = false;
  passcode: string = "";
  canUpload = false;
  debugVar = 0;

  levels: string[] = [];
  isLoading = false;
  private isProcessed: boolean = false;
  directoryData = {
    directory: "/uploads",
    passphrase: ""
  };

  constructor(
    private notification: NzNotificationService,
    private modal: NzModalRef
  ) { }

  ngOnInit() {
    this.directoryData.directory = this.directory;
  }

  checkPass = () => {
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
        this.modal.close();
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
        this.modal.close();
        this.isLoading = false;
        break;
    }
  }
}
