import { Component, OnInit } from "@angular/core";
import { async } from "@angular/core/testing";
import { NzModalService, NzNotificationService } from "ng-zorro-antd";
import { PopupComponent } from "src/app/components/popup/popup.component";
import { UploadComponent } from "src/app/components/upload/upload.component";
import { ApiService, Entry } from "src/app/services/api.service";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
})
export class PreviewComponent implements OnInit {
  data: Entry[] = [];
  levels: string[] = [];
  isLoading = false;

  constructor(
    private api: ApiService,
    private modal: NzModalService,
    private notification: NzNotificationService
  ) {}

  private async getFiles() {
    this.isLoading = true;
    try {
      this.data = await this.api.getFiles("/" + this.levels.join("/"));
    } finally {
      this.isLoading = false;
    }
  }

  private viewDirectory(levels: string[]) {
    this.levels = levels;
    this.getFiles();
  }

  private async createFolder(name: string) {
    this.isLoading = true;
    try {
      if (this.levels.length == 0) await this.api.createDir(`/${name}`);
      await this.api.createDir(`/${this.levels.join("/")}/${name}`);
      this.notification.success("Success", "New folder created.");
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    this.isLoading = false;
  }

  private async createFileFromCID(cid: string) {
    this.isLoading = true;
    try {
      this.api.copy(`/ipfs/${cid}`, "/" + this.levels.join("/"));
      this.notification.success("Success", "File imported.");
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    this.isLoading = false;
  }

  navDirectory(count: number) {
    this.levels = this.levels.slice(0, count + 1);
    this.getFiles();
  }

  navHome() {
    this.levels = [];
    this.getFiles();
  }

  viewEntry(entry: Entry) {
    if (entry.type == "directory")
      this.viewDirectory([...this.levels, entry.name]);
  }

  uploadFile() {
    this.modal
      .create({
        nzTitle: "Upload File",
        nzContent: UploadComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzOkText: null,
        nzComponentParams: {
          directory: "/" + this.levels.join("/"),
        },
      })
      .afterClose.subscribe(() => {
        this.getFiles();
      });
  }

  uploadFolder() {
    this.modal
      .create({
        nzTitle: "Upload Folder",
        nzContent: UploadComponent,
        nzMaskClosable: false,
        nzClosable: false,
        nzOkText: null,
        nzComponentParams: {
          isDirectory: true,
          directory: "/" + this.levels.join("/"),
        },
      })
      .afterClose.subscribe(() => {
        this.getFiles();
      });
  }

  makeFolder() {
    const ref = this.modal.create({
      nzTitle: "New Folder",
      nzContent: PopupComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        placeholder: "Folder name",
      },
      nzOnOk: async () => {
        await this.createFolder(ref.getContentComponent().value);
        this.getFiles();
      },
    });
  }

  importCID() {
    const ref = this.modal.create({
      nzTitle: "Import via CID",
      nzContent: PopupComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        placeholder: "CID",
      },
      nzOnOk: async () => {
        await this.createFileFromCID(ref.getContentComponent().value);
        setTimeout(() => {
          this.getFiles();
        }, 1000);
      },
    });
  }

  ngOnInit() {
    this.getFiles();
  }
}
