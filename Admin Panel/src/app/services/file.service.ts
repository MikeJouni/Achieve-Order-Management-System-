import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  url = environment.baseUrl;
  fileUrl = environment.baseUrl + 'file/';
  constructor(
    public http: HttpClient
  ) { }
  uploadFile(file) {
    const fd = new FormData();
    fd.append("file", file);
    return this.http.post(this.url + "file/upload", fd);
  }

}
