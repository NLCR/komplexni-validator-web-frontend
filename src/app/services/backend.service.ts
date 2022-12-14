import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, tap, delay } from 'rxjs';
import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private baseUrl: string;

  constructor(private http: HttpClient, private appSettings: AppSettingsService) {
    this.baseUrl = this.appSettings.adminApiBaseUrl;
  }

  private doGet(path: string, params: any, type = 'json'): Observable<Object> {
    const options = {
      params: params
    };
    if (type === 'text') {
      //options['responseType'] = 'text';
      //options['observe'] = 'response';
    }
    return this.http.get(this.baseUrl + path, options);
  }

  private get(path: string, params = {}): Observable<Object> {
    return this.doGet(path, params);
  }

  // private getText(path: string, params = {}): Observable<string> {
  //   return this.doGet(path, params, 'text').pipe(map(response => response['body']));
  // }

  private head(path: string, options = {}): Observable<Object> {
    return this.http.head(this.baseUrl + path, options);
  }

  private post(path: string, body: any, options = {}): Observable<Object> {
    return this.http.post(this.baseUrl + path, body, options);
  }

  private put(path: string, body: any, options: any = {}): Observable<Object> {
    return this.http.put(this.baseUrl + path, body, options);
  }

  /*
  private delete(path: string): Observable<Object> {
    return this.http.delete(this.baseUrl + path, {});
  }
  */

  private delete(path: string, options = {}): Observable<Object> {
    return this.http.delete(this.baseUrl + path, options);
  }

  test(): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Authorization': 'Basic blabla' }) };

    // return this.get(`/kstats_1/_search`, {
    //   //'model': model
    // }).pipe(
    //   //delay(1500),
    //   tap(response => {
    //     //console.log(response)
    //   })
    // );

    return this.post(`/kstats_1/_search`, { something: "value" }, options)
      .pipe(
        //delay(500),
        tap(response => {
          //console.log(response)
        })
      );
  }

  getQuotas(): Observable<any> {
    return this.get(`/quotas`, {
      //'model': model
    }).pipe(
      //delay(1500),
      tap(response => {
        //console.log(response)
      })
    );
  }

  setQuota(quota: any, value: any): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'text/plain' }) };
    return this.put(`/quotas/${quota}`,
      value,
      options
    ).pipe(
      //delay(500),
      tap(response => {
        //console.log(response)
      })
    );
  }

  getValidations(): Observable<any> {
    return this.get(`/validations`)
      .pipe(
        //delay(500),
        tap(response => {
          //console.log(response)
        })
      );
  }

  getValidation(id: string): Observable<any> {
    return this.get(`/validations/${id}`)
      .pipe(
        //delay(500),
        tap(response => {
          //console.log(response)
        })
      );
  }

  uploadPackage(ownerId: string, note: string): Observable<any> {
    return this.post(`/uploads`, { ownerId: ownerId, note: note })
      .pipe(
        //delay(500),
        tap(response => {
          //console.log(response)
        })
      );
  }

  cancelValidation(id: string): Observable<any> {
    const options = { headers: new HttpHeaders({ 'Content-Type': 'text/plain' }) };
    return this.put(`/validations/${id}/state`,
      'CANCELED',
      options
    ).pipe(
      //delay(500),
      tap(response => {
        //console.log(response)
      })
    );
  }

  createValidationTest(formData: any): Observable<any> {
    return this.post(`/validations/upload-test`,
      formData
      //{ ownerId: ownerId, priority: priority, note: note }

    )
      .pipe(
        //delay(500),
        tap(response => {
          console.log(response)
        })
      );
  }

}
