import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {Post} from '../post';
import {Observable, of} from 'rxjs';

@Injectable()
export class DataService {

  ELEMENT_DATA: Post[] = [
    {position: 0, title: 'Post One', category: 'Web Development', date_posted: new Date(), body: 'Body 1'},
    {position: 1, title: 'Post Two', category: 'Android Development', date_posted: new Date(), body: 'Body 2'},
    {position: 2, title: 'Post Three', category: 'IOS Development', date_posted: new Date(), body: 'Body 3'},
    {position: 3, title: 'Post Four', category: 'Android Development', date_posted: new Date(), body: 'Body 4'},
    {position: 4, title: 'Post Five', category: 'IOS Development', date_posted: new Date(), body: 'Body 5'},
    {position: 5, title: 'Post Six', category: 'Web Development', date_posted: new Date(), body: 'Body 6'},
  ];
  categories = [
    {value: 'Web-Development', viewValue: 'Web Development'},
    {value: 'Android-Development', viewValue: 'Android Development'},
    {value: 'IOS-Development', viewValue: 'IOS Development'}
  ];

  constructor(private httpClient: HttpClient) {
  }

  getData(): Observable<Post[]> {
    return of<Post[]>(this.ELEMENT_DATA);
  }

  getCategories() {
    return this.categories;
  }

  addPost(data: Post) {
    this.ELEMENT_DATA.push(data);
  }

  deletePost(index: number) {
    this.ELEMENT_DATA = [...this.ELEMENT_DATA.slice(0, index), ...this.ELEMENT_DATA.slice(index + 1)];
  }

  dataLength() {
    return this.ELEMENT_DATA.length;
  }

  getUserData(username: string, password: string) {
    const b64 = btoa(username+":"+password)
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': 'Basic ' +b64, 
      })
    };
    return this.httpClient.get('http://localhost:5000/api/v1/user', options);
  }

  getScopeTelemetryData(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('metric', 'scope').set('company', company)
    };
    return this.httpClient.get('http://localhost:5000/api/v1/data', options);
  }
}