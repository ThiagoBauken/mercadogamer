import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { GlobalService } from './global.service';
import captureVideoFrame from 'capture-video-frame';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  serviceName = '';

  constructor(public http: HttpClient, public global: GlobalService) {
    this.initialize();
  }

  initialize() {
    this.buildServiceName();
  }

  buildServiceName() {
    this.serviceName = this.constructor.name
      .replace('Service', '')
      .toLowerCase();
  }

  // (+) Items

  getAll(
    endPoint,
    filters = {},
    sort = {},
    populates = [],
    page = 0,
    perPage = 0
  ) {
    const action =
      '/?_filters=' +
      encodeURI(JSON.stringify(filters)) +
      '&_sort=' +
      encodeURI(JSON.stringify(sort)) +
      '&_populates=' +
      encodeURI(JSON.stringify(populates)) +
      '&_page=' +
      page +
      '&_perPage=' +
      perPage;

    return this.get(endPoint + action);
  }

  getById(endPoint, id, populates = []) {
    return this.get(
      `${endPoint}/${id}?_populates=${encodeURI(JSON.stringify(populates))}`
    );
  }

  // create(value, endPoint = '/' + this.getServiceName()) {
  //   return this.post(value, '', endPoint);
  // }

  // update(value, endPoint = '/' + this.getServiceName()) {
  //   return this.put(value, '/' + value.id, endPoint);
  // }

  // remove(value, endPoint = '/' + this.getServiceName()) {
  //   return this.delete('/' + value.id, endPoint);
  // }

  // (-) Items

  // (+) Basic

  delete(endPoint = '/' + this.getServiceName()) {
    const url = environment.serverUrl + endPoint;
    return this.http
      .delete(url, this.getHeaders())
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError.bind(this));
  }

  put(endPoint, value) {
    const url = environment.serverUrl + endPoint;
    return this.http
      .put(url, value, this.getHeaders())
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError.bind(this));
  }

  post(endPoint, value) {
    const url = environment.serverUrl + endPoint;
    return this.http
      .post(url, value, this.getHeaders())
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError.bind(this));
  }

  patch(value, action, endPoint = '/' + this.getServiceName()) {
    const url = environment.serverUrl + endPoint + action;
    return this.http
      .patch(url, value, this.getHeaders())
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError.bind(this));
  }

  get(endPoint) {
    const url = environment.serverUrl + endPoint;
    return this.http
      .get(url, this.getHeaders())
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError.bind(this));
  }

  // (-) Basic

  postFile(file: File) {
    const url =
      environment.serverUrl + this.global.settings.endPoints.files + '/upload';

    const fd = new FormData();
    if (file.type.startsWith('video')) {
      // const video = document.createElement('video');
      const video = document.getElementById('temp-video') as HTMLVideoElement;
      video.setAttribute('id', 'temp-video');
      video.setAttribute('preload', 'metadata');
      // video.src = file;
      const source = document.createElement('source');
      video.innerHTML = '';

      source.setAttribute('src', URL.createObjectURL(file));
      source.setAttribute('type', file.type);
      video.appendChild(source);
      return video.play().then(() => {
        const frame = captureVideoFrame('temp-video', 'png');
        fd.append('file', frame.blob, `${Date.now()}.png`);
        // video.remove();
        return this.http
          .post(url, fd)
          .toPromise()
          .then((response: any) => {
            return response;
          })
          .catch(this.handleError);
      });
    } else {
      fd.append('file', file);
      return this.http
        .post(url, fd)
        .toPromise()
        .then((response: any) => {
          return response;
        })
        .catch(this.handleError);
    }
  }

  createFile(file) {
    const url =
      environment.serverUrl + this.global.settings.endPoints.files + '/upload';

    const fd = new FormData();
    fd.append('file', file);

    return this.http
      .post(url, fd)
      .toPromise()
      .then((response: any) => response)
      .catch(this.handleError);
  }

  getHeaders(): any {
    const token = localStorage.getItem(this.global.settings.storage.token);
    return {
      headers: new HttpHeaders({
        'x-access-token': token || '',
      }),
    };
  }

  // deleteFiles(arr) {
  //   const url = environment.serverUrl + this.global.settings.endPoints.files + '/delete';
  //   const headers: any = {}
  //   const options = new RequestOptions({
  //     headers: headers,
  //     body: arr
  //   })
  //   return this.http.delete(url, options)
  //     .toPromise()
  //     .then(response => response)
  //     .catch(err => this.handleError.bind(err));
  // }

  handleError(error: any) {
    console.log(error);
    let message = 'Ha ocurrido un error';
    if (error.error && error.error.message) {
      message = error.error.message;
    }

    let status = 500;
    if (error.status) {
      status = error.status;
    }

    const httpError = { status, message };
    console.log({ httpError });
    // return httpError;
    return Promise.reject(httpError);
  }

  getServiceName() {
    return this.serviceName;
  }
}
