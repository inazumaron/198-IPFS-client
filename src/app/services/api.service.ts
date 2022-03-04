import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface Entry {
  name: string;
  type: "directory" | "file";
  size: number;
  cid: string;
  is_pinned_pinata: boolean;
  is_pinned_pinata_queue: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private readonly host = "/api";
  decrypt_error: boolean = false;
  decrypt_loading: boolean = true;

  constructor(private http: HttpClient) {}

  checkKey() {
    return this.http.get(`${this.host}/keys`, {withCredentials: true}).toPromise();
  }

  createKey(key: string, sKey: string) {
    console.log(key," -- ",sKey);
    return this.http
      .post(
        `${this.host}/keys`,
        { pinata_api: key, pinata_secret: sKey },
        { withCredentials: true }
      )
      .toPromise();
  }

  getFiles(directory: string) {
    return this.http
      .put<Entry[]>(
        `${this.host}/files/list`,
        { directory },
        { withCredentials: true }
      )
      .toPromise();
  }

  createDir(directory: string) {
    return this.http
      .post(
        `${this.host}/files/directory`,
        { directory },
        { withCredentials: true }
      )
      .toPromise();
  }

  copy(from: string, to: string) {
    return this.http
      .put(`${this.host}/files/copy`, { from, to }, { withCredentials: true })
      .toPromise();
  }

  move(from: string, to: string) {
    return this.http
      .post(`${this.host}/files/move`, { from, to }, { withCredentials: true })
      .toPromise();
  }

  remove(directory: string) {
    return this.http
      .post(
        `${this.host}/files/remove`,
        { directory },
        { withCredentials: true }
      )
      .toPromise();
  }

  pin(cid: string) {
    return this.http
      .put(
        `${this.host}/files/pin/pinata/${cid}`,
        { cid },
        { withCredentials: true }
      )
      .toPromise();
  }

  unpin(cid: string) {
    return this.http
      .delete(`${this.host}/files/pin/pinata/${cid}`, { withCredentials: true })
      .toPromise();
  }

  decrypt(cid: string, filename: string, passphrase: string) {
    this.decrypt_loading = true;
    return this.http
      .post(
        `${this.host}/files/bundle/${cid}`,
        { cid, filename, passphrase },
        { withCredentials: true, observe: "response", responseType: "blob" }
      )
      .subscribe(
        (resp) => {
          console.log("resp");
          console.log(resp);
          this.downloadFile(resp.body, resp.headers.get("File-Name"));
          this.decrypt_error = false;
          this.decrypt_loading = false;
        },
        (err) => {
          console.error("decrypting failed");
          this.decrypt_error = true;
          this.decrypt_loading = false;
        }
      );
  }

  getFile(cid: string, filename: string) {
    console.time("x");
    return this.http
      .get(`${this.host}/files/${cid}`, {
        withCredentials: true,
        responseType: "blob",
      })
      .subscribe((resp) => {
        this.downloadFile(resp, filename);
      });
  }

  private downloadFile(data, fileName: string) {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    console.timeEnd("x");
  }

  decryptError() {
    return this.decrypt_error;
  }
}
