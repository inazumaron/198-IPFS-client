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
      .post(`${this.host}/files/copy`, { from, to }, { withCredentials: true })
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
    .put(`${this.host}/files/pin/pinata/${cid}`, { cid }, {withCredentials: true})
    .toPromise();
  }

  unpin(cid: string) {
    return this.http
    .delete(`${this.host}/files/pin/pinata/${cid}`, {withCredentials: true})
    .toPromise();
  }

  decrypt(cid: string, filename: string, passphrase: string) {
    this.decrypt_loading = true;
      return this.http
      .post(`${this.host}/files/bundle/${cid}`, { cid, filename, passphrase }, {withCredentials: true, responseType: "blob"})
      .subscribe(resp=>{
        this.downloadFile(resp, filename);
        this.decrypt_error = false;
        this.decrypt_loading = false;
      },
      err => {
        console.error("decrypting failed");
        this.decrypt_error = true;
        this.decrypt_loading = false;
      }
      );
  }

  private downloadFile(data, fileName) {
    const blob = new Blob([data]);
    const url = window.URL.createObjectURL(blob);
    //Open a new window to download
    // window.open(url); 
  
    //Download by dynamically creating a tag
    const a = document.createElement('a');
    a.href = url;
    // a.download = fileName;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  decryptError() {
    return this.decrypt_error;
  }
}
