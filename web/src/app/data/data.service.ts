import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Injectable()
export class DataService {

  constructor(private httpClient: HttpClient) {}

  getUserData(username: string, password: string) {
    const b64 = btoa(username+":"+password)
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json',
        'Authorization': 'Basic ' +b64, 
      })
    };
    return this.httpClient.get('http://localhost:5050/api/v1/user', options);
  }

  getScopeTelemetryData(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('metric', 'scope').set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/data', options);
  }

  getScopeTelemetryDataByProduct(company: string, product: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('metric', 'scope').set('company', company).set('product', product)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/data', options);
  }

  getCreditTelemetryData() {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('metric', 'credit')
    };
    return this.httpClient.get('http://localhost:5050/api/v1/data', options);
  }

  getGraphData(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/graph', options);
  }

  getProducts(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/product', options);
  }

  getReports(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/report', options);
  }

  getAds(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/ad', options);
  }

  getCertificates(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/certificate', options);
  }

  getBalance(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/balance', options);
  }

  getTransactions(company: string) {
    const options = {
      headers: new HttpHeaders({
        'Content-type': 'application/json'
      }),
      params: new HttpParams().set('company', company)
    };
    return this.httpClient.get('http://localhost:5050/api/v1/transaction', options);
  }
}
