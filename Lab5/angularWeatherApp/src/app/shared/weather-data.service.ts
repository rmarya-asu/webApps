import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';


@Injectable()
export class WeatherDataService {
  private _weatherDataUrl = 'http://api.openweathermap.org/data/2.5/weather?q=Bangalore&APPID=9c1cd66b77e2f2317d15fffb64eeef6e';

  constructor(private _http: HttpClient) { }
  getWeatherData(): Observable <any> {
    return this._http.get(this._weatherDataUrl);
  }
  private handleError(err: HttpErrorResponse) {
    console.error(err.message);
    return Observable.throw(err.message);
  }
}
