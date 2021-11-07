import { Component, Input, OnInit } from "@angular/core";
import { NzModalRef, NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "app-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.css"],
})
export class UploadComponent implements OnInit {
  @Input() directory: string = "";
  @Input() isDirectory = false;
  isLoading = false;

  constructor(
    private notification: NzNotificationService,
    private modal: NzModalRef
  ) {}

  handleChange(info: { file: any }): void {
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

  ngOnInit() {}
}
