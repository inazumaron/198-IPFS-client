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
import { PopupDeComponent } from "src/app/components/popup-de/popup-de.component";
import { UploadEnComponent } from "src/app/components/upload-en/upload-en.component";
import { ApiService, Entry } from "src/app/services/api.service";
import { KeysComponent } from "src/app/components/keys/keys.component";
import { EnDownPopupComponent } from "src/app/en-down-popup/en-down-popup.component";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.css"],
})
export class PreviewComponent implements OnInit {
  readonly peer_threshold = 3;

  data: Entry[] = [];
  levels: string[] = [];
  isLoading = false;
  keyMissing = false;
  lowPeers: boolean = true;
  peers = 0;
  blankSpace: number[] = [];

  private paste_mode: "move" | "copy" = "copy";
  private active_item: Entry;

  clipboard = "";

  constructor(
    private api: ApiService,
    private modal: NzModalService,
    private notification: NzNotificationService,
    private cmenu: NzContextMenuService
  ) {}

  async ngOnInit() {
    this.keyMissing = await this.checkKeySet();
    if (!this.keyMissing) {
      this.startPolling();
    } else {
      this.keyPrompt();
    }
  }

  private startPolling() {
    this.getFiles();
    setInterval(() => {
      this.getFilesSilent();
    }, 3 * 1000);
    setInterval(() => {
      this.peerCheck();
    }, 3 * 1000);
  }

  async peerCheck() {
    const x = await this.api.getPeers();
    this.peers = x;
    this.lowPeers = x < this.peer_threshold;
  }

  keyPrompt() {
    const ref = this.modal.create({
      nzTitle: "Input Pinata keys",
      nzContent: KeysComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: async () => {
        try {
          await this.generateKeys(
            ref.getContentComponent().value,
            ref.getContentComponent().value2
          );
        } finally {
          this.startPolling();
        }
      },
    });
  }

  async generateKeys(key: string, key2: string) {
    try {
      await this.api.createKey(key, key2);
    } catch (error) {
      console.error(error);
    }
  }

  async checkKeySet() {
    const temp = await this.api.checkKey();
    console.log(temp);
    var res = true;
    try {
      //@ts-ignore
      res = temp.is_missing;
    } catch (error) {
      res = true;
    }
    return res;
  }

  private async getFiles() {
    this.isLoading = true;
    try {
      this.data = await this.api.getFiles("/" + this.levels.join("/"));
    } finally {
      this.isLoading = false;
      this.computeBlankSpace();
    }
  }

  computeBlankSpace() {
    if (this.data.length < 10)
      this.blankSpace = Array(10 - this.data.length).fill(0);
  }

  private async getFilesSilent() {
    try {
      this.data = await this.api.getFiles("/" + this.levels.join("/"));
    } finally {
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

  private async createFileFromCID(cid: string, name: string) {
    if (!cid) return this.notification.error("Failed", "Empty CID");
    this.isLoading = true;
    try {
      await this.api.import(cid, "/" + this.levels.join("/"), name);
      if (this.lowPeers)
        this.notification.warning(
          "Warning",
          "Import may fail due to low peer count"
        );
      else this.notification.success("Success", "File imported.");
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    this.isLoading = false;
  }

  private async createFileFromCIDDe(cid: string, passcode: string) {
    this.isLoading = true;
    try {
      this.api.decrypt(cid, cid, passcode);
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Something went wrong.");
    }
    while (this.api.decrypt_loading) {
      await new Promise((f) => setTimeout(f, 100));
    }
    if (this.api.decryptError()) {
      this.notification.error("Failed", "Invalid passcode");
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
      return this.viewDirectory([...this.levels, entry.name]);

    if (entry.status_content != "available") return;
    this.download(entry.cid, entry.name);
  }

  copyCID(entry: Entry) {
    navigator.clipboard.writeText(entry.cid);
    this.notification.success("Success", "CID copied to clipboard");
  }

  uploadFile() {
    console.log("/" + this.levels.join("/"));
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

  uploadFileEncrypted() {
    this.modal
      .create({
        nzTitle: "Upload and ecrypt File",
        nzContent: UploadEnComponent,
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
        await this.createFileFromCID(
          ref.getContentComponent().value,
          ref.getContentComponent().name
        );
        this.getFilesSilent();
      },
    });
  }

  importCIDDecrypted() {
    const ref = this.modal.create({
      nzTitle: "Import via CID",
      nzContent: PopupDeComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        placeholder: "CID",
      },
      nzOnOk: async () => {
        await this.createFileFromCIDDe(
          ref.getContentComponent().value,
          ref.getContentComponent().passcode
        );
        this.getFiles();
      },
    });
  }

  contextMenu(
    $event: MouseEvent,
    menu: NzDropdownMenuComponent,
    item: Entry
  ): void {
    if (item.status_content != "available") return;
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

  rename() {
    const ref = this.modal.create({
      nzTitle: "Rename",
      nzContent: PopupComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {
        placeholder: "File name",
      },
      nzOnOk: async () => {
        let res = ref.getContentComponent().value;
        await this.api.rename(
          this.levels.join("/"),
          this.active_item.name,
          res
        );
        await this.getFilesSilent();
      },
    });
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
        this.getFiles();
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
      if (this.active_item.type == "directory")
        this.notification.error("Failed", "Folder is not empty");
      else this.notification.error("Failed", "Can not delete file.");
    }
    this.isLoading = false;
  }

  async paste() {
    const to = "/" + this.levels.join("/");
    const dir = this.clipboard
      .split("/")
      .slice(0, this.clipboard.split("/").length - 1)
      .join("/");
    if (dir == to) return;

    this.isLoading = true;
    try {
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
      this.notification.success(
        "Success",
        "File now in pin queue. Pinning may take a while to finish"
      );
      this.getFiles();
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Pinning failed");
    }
  }

  async unpin(item) {
    try {
      await this.api.unpin(item.cid);
      this.notification.success("Success", "File unpinned.");
      this.getFiles();
    } catch (err) {
      console.error(err);
      this.notification.error("Failed", "Failed to unpin");
    }
  }

  async download(cid: string, filename: string) {
    var isEncrypted = false;
    try {
      isEncrypted = await this.api.isEncrypted(cid);
    } catch (error) {
      console.log(error);
    }
    if (isEncrypted) this.downloadEncrypted(cid, filename);
    else this.api.getFile(cid, filename);
  }

  downloadEncrypted(cid: string, filename: string) {
    const ref = this.modal.create({
      nzTitle:
        "Whoops, looks like the file you're trying to download is encrypted.",
      nzContent: EnDownPopupComponent,
      nzMaskClosable: false,
      nzClosable: false,
      nzComponentParams: {},
      nzOnOk: async () => {
        const mode = ref.getContentComponent().skip;
        if (!mode) {
          await this.createFileFromCIDDe(
            cid,
            ref.getContentComponent().passcode
          );
          this.getFiles();
        } else {
          this.api.getFile(cid, filename);
        }
      },
    });
  }

  queue() {
    this.notification.error("Queuing", "Still queuing");
  }

  async cancelImport(item) {
    await this.api.cancelImport(item.cid, "/" + this.levels.join("/"));
    await this.getFilesSilent();
    this.notification.success("Success", "Import cancelled.");
  }
}
