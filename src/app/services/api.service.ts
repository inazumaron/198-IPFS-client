import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface Entry {
  name: string;
  type: "directory" | "file";
  size: number;
  cid: string;

  status_pin: "unpinned" | "queued" | "pinned";
  status_content:
    | "searching"
    | "downloading"
    | "timeout"
    | "failed"
    | "available";

  is_encrypted: boolean;
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
    return this.http
      .get(`${this.host}/keys`, { withCredentials: true })
      .toPromise();
  }

  createKey(key: string, sKey: string) {
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
          this.downloadFile(resp.body, resp.headers.get("File-Name"));
          this.decrypt_error = false;
          this.decrypt_loading = false;
        },
        (err) => {
          this.decrypt_error = true;
          this.decrypt_loading = false;
        }
      );
  }

  getFile(cid: string, filename: string) {
    const url = `${this.host}/files/${cid}?name=${filename}`;
    window.open(url, "_blank").focus();
  }

  private downloadFile(data, fileName?: string) {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    if (fileName) a.download = fileName;
    else a.download = "file";
    a.click();
    window.URL.revokeObjectURL(url);
  }

  decryptError() {
    return this.decrypt_error;
  }

  import(cid: string, directory: string, name: string) {
    return this.http
      .put(
        `${this.host}/files/import/${cid}`,
        { directory, name },
        { withCredentials: true}
      )
      .toPromise();
  }

  isEncrypted(cid: string) {
    return this.http
      .get<{ is_encrypted: boolean }>(`${this.host}/files/encrypted/${cid}`, {
        withCredentials: true,
      })
      .toPromise()
      .then((x) => x.is_encrypted);
  }

  getPeers() {
    return this.http.get(`${this.host}/peers`, { withCredentials: true })
    .toPromise();
  }

  cancelImport(cid: string) {
    return this.http.delete(`${this.host}/files/import/${cid}`, { withCredentials: true })
    .toPromise();
  }
}
