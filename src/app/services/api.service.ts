import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

export interface Entry {
  name: string;
  type: "directory" | "file";
  size: number;
  cid: string;
}

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private readonly host = "/api";

  constructor(private http: HttpClient) {}

  getFiles(directory: string) {
    return this.http
      .post<Entry[]>(
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
}
