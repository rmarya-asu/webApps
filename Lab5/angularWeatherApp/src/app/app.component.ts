import { Component } from '@angular/core';
import {WeatherDataService} from "./shared/weather-data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [WeatherDataService]
})
export class AppComponent {
  title = 'weather app';
}
