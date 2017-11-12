import { Component, OnInit } from '@angular/core';
import {WeatherDataService} from '../shared/weather-data.service';

@Component({
  selector: 'app-weather-table',
  templateUrl: './weather-table.component.html',
  styleUrls: ['./weather-table.component.css']
})
export class WeatherTableComponent implements OnInit {
  // weatherData is an array of weather ffom cities. NEED an interface to define type of the data I"m holding
  _weatherData: ICity[];
  errorMessage: string;
  constructor(private _weatherDataService: WeatherDataService) { }

  ngOnInit() {
    this._weatherDataService.getWeatherData().subscribe(data => {
      // const city = new ICity(data.name, data.sys.country, data.dt, data.main.temp, data.main.humidity, data.wind.speed, data.couds.all);
      let city: ICity;
      city.name = data.name;
      city.country = data.sys.country;
      city.time = data.dt;
      city.temp = data.main.temp;
      city.humidity = data.main.humidity;
      city.windSpeed = data.wind.speed;
      city.clouds = data.couds.all;
      this._weatherData.push(city);
    } , error => this.errorMessage = <any> error);
  }
  // parseWeatherData = function(data, next){
  //
  // }
  func() {
    console.log(this._weatherData);
  }

}

export interface ICity {
  name: string;
  country: string;
  time: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  clouds: number;
}

const WEATHER_DATA: ICity[] = [
  {name: 'bangalore', country: 'Hydrogen', time: '241240079', temp: 23, humidity: 13, windSpeed: 34, clouds: 23},
  {name: 'bangalore', country: 'Hydrogen', time: '241240079', temp: 23, humidity: 13, windSpeed: 4, clouds: 23}];
