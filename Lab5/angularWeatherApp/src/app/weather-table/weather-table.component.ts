import { Component, OnInit } from '@angular/core';
import {WeatherDataService} from '../shared/weather-data.service';

@Component({
  selector: 'app-weather-table',
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.css']
})
export class WeatherTableComponent implements OnInit {
  _weatherData: any;
  errorMessage: string;
  constructor(private _weatherDataService: WeatherDataService) { }

  ngOnInit() {
    this._weatherDataService.getWeatherData().subscribe(data => {
      this._weatherData = data;
    } , error => this.errorMessage = <any> error);
  }
  func() {
    console.log(this._weatherData);
  }

}
