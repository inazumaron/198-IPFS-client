import { Component, OnInit } from "@angular/core";
import { async } from "@angular/core/testing";
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
  NzModalService,
  NzNotificationService,
} from "ng-zorro-antd";
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

  private paste_mode: "move" | "copy" = "copy";
  private active_item: Entry;

  clipboard = "";

  constructor(
    private api: ApiService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private cmenu: NzContextMenuService
  ) {}

  private async getFiles() {
    this.isLoading = true;
    try {
      this.data = await this.api.getFiles("/"+ this.levels.join("/"));
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
          directory: "\\" + this.levels.join("\\"),
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

  contextMenu(
    $event: MouseEvent,
    menu: NzDropdownMenuComponent,
    item: Entry
  ): void {
    this.active_item = item;
    this.cmenu.create($event, menu);
  }

  contextMenuEmpty($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.cmenu.create($event, menu);
  }

  copy() {
    this.paste_mode = "copy";
    const file = `${this.levels.join("/")}/${this.active_item.name}`;

    if (this.levels.length) this.clipboard = "/" + file;
    else this.clipboard = file;
  }

  move() {
    this.paste_mode = "move";
    const file = `${this.levels.join("/")}/${this.active_item.name}`;
    if (this.levels.length) this.clipboard = "/" + file;
    else this.clipboard = file;
  }

  delete() {
    let file_path = "";
    const file = `${this.levels.join("/")}/${this.active_item.name}`;
    if (this.levels.length) file_path = "/" + file;
    else file_path = file;

    this.modal.confirm({
      nzTitle: `Delete ${this.active_item.name}?`,
      nzContent: "Note: This can not be undone.",
      nzOkText: "OK",
      nzCancelText: "Cancel",
      nzOnOk: async () => {
        await this.deleteNow(file_path);
      },
    });
  }

  view() {
    const url = `/api/files/${this.active_item.cid}`;
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = this.active_item.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  async deleteNow(file_path: string) {
    this.isLoading = true;
    try {
      await this.api.remove(file_path);
      this.getFiles();
      this.notification.success("Success", "File deleted.");
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    this.isLoading = false;
  }

  async paste() {
    this.isLoading = true;
    try {
      const to = "/" + this.levels.join("/");
      if (this.paste_mode == "copy") {
        await this.api.copy(this.clipboard, to);
        this.notification.success("Success", "File copied.");
      } else {
        await this.api.move(this.clipboard, to);
        this.notification.success("Success", "File moved.");
        this.clipboard = "";
      }
      this.getFiles();
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    this.isLoading = false;
  }

  async pin(item) {
    try {
      await this.api.pin(item.cid);
      this.notification.success("Success", "File now in queue. Please wait while it's being processed");
    } catch (err){
      console.error(err);
      this.notification.error("Failed", "Pinning failed");
    }
  }

  async unpin(item) {
    try {
      await this.api.unpin(item.cid);
      this.notification.success("Success", "File unPinned.");
    } catch (err){
      console.error(err);
      this.notification.error("Failed", "Failed to unpin");
    }
  }

  queue() {
    this.notification.error("Queuing", "Still queuing");
  }
}
