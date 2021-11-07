import { Component, Input, OnInit } from "@angular/core";
import { NzModalRef, NzNotificationService } from "ng-zorro-antd";
import { from } from "rxjs";
import { ApiService } from "src/app/services/api.service";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"],
})
export class UploadComponent implements OnInit {
  @Input() directory: string = "";
  @Input() isDirectory = false;
  isLoading = false;
  private isProcessed: boolean = false;
  directoryData = {
    directory: "",
  };

  constructor(
    private notification: NzNotificationService,
    private modal: NzModalRef
  ) {}

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

  ngOnInit() {
    this.directoryData.directory = this.directory;
  }
}
