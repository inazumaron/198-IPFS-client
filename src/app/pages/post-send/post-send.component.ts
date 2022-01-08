import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiService } from "src/app/services/api.service";
import { NzNotificationService } from "ng-zorro-antd";

@Component({
  selector: "app-post-send",
  templateUrl: "./post-send.component.html",
  styleUrls: ["./post-send.component.css"],
})
export class PostSendComponent implements OnInit {
  CID = "";
  Passcode = "";
  isCopied = false;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private notification: NzNotificationService
  ) {}

  ngOnInit() {
    this.CID = this.route.snapshot.paramMap.get("cid");
    this.Passcode = this.route.snapshot.paramMap.get("pc");
  }

  private copyOld(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.display = "none";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  async copy(text: string) {
    if (!navigator.clipboard) {
      this.copyOld(text);
      this.isCopied = true;
      return;
    }
    await navigator.clipboard.writeText(text);
    this.isCopied = true;
  }

  async pin() {
    try {
      await this.api.pin(this.CID);
      this.notification.success(
        "Pin Queued",
        "File now in pin queue. Please wait while it's being processed"
      );
    } catch (err) {
      console.error(err);
      this.notification.error("Pin Failed", "Something went wrong.");
    }
  }
}
