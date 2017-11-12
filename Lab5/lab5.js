// 9c1cd66b77e2f2317d15fffb64eeef6e
// 8988eae58b1eefdc66b197363ade25ab
var WEATHER_DATA = [];
const CITY_WEATHER_URL = 'http://api.openweathermap.org/data/2.5/weather?q=';
const API_KEY = '&APPID=9c1cd66b77e2f2317d15fffb64eeef6e';

var City_weather = function(city, country, time, temp, humidity, windSpeed, cloudiness) {
  this.name = city;
  this.country = country;
  this.temp = parseInt(temp);
  this.humidity = parseInt(humidity);
  this.wind = parseInt(windSpeed);
  this.cloudiness = parseInt(cloudiness);
  this.time = time;

  function setFormats() {

  }
};

function extractWeatherData(place) {
  place.fullName = place.name + ',' + place.country;
  place.tempC = place.temp - 273.15;
  place.windMPH = place.wind * (25 / 11);
  return place;
}

function getRequestObject() {
  if (window.XMLHttpRequest) {
    return (new XMLHttpRequest());
  } else {
    return (null);
  }
}

// Make an HTTP request to the given address.
function makeHttpCall(address, next) {
  var request = getRequestObject();
  request.onreadystatechange =
    function() {
      if ((request.readyState == 4) &&
        (request.status == 200)) {
        next(request.responseText);
      }
    }
  request.open("GET", address, true);
  request.send(null);
}

//code from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
function storageAvailable(type) {
  try {
    var storage = window[type],
      x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage.length !== 0;
  }
}

function populateTable(city) {

  var cityWeather = new City_weather(city.name, city.sys.country, city.dt, city.main.temp, city.main.humidity, city.wind.speed, city.clouds.all);
  extractWeatherData(cityWeather);
  var tbody = document.getElementById('tbody');
  console.log(city.clouds.all);
  var time = new Date(city.dt);
  console.log(cityWeather);
  let tr = document.createElement('TR');
  let td = document.createElement('TD');
  td.className = "mdl-data-table__cell--non-numeric";
  td.innerText = cityWeather.name + ',' + cityWeather.country;
  let td1 = document.createElement('TD');
  //have a problem with date time here. fix it.
  console.log(cityWeather.time);
  td1.innerText = time.getDate() + ":" + time.getMonth() + ":" + time.getUTCFullYear() + ':' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
  let td2 = document.createElement('TD');
  td2.innerText = cityWeather.tempC;
  let td3 = document.createElement('TD');
  td3.innerText = cityWeather.humidity;
  let td4 = document.createElement('TD');
  td4.innerText = cityWeather.windMPH;
  let td5 = document.createElement('TD');
  td5.innerText = cityWeather.cloudiness;
  tr.appendChild(td);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  tbody.appendChild(tr);
}

function populateTableFromLocalStorage() {
  WEATHER_DATA = JSON.parse(localStorage.getItem('weather'));
  for (var index in WEATHER_DATA) {
    populateTable(WEATHER_DATA[index]);
  }
}

function calculateStats() {

}

function addButtonClicked(){
  console.log('Button clicked, verify for input sanity');
  var cityName = document.getElementById('cities-list').value;
  if(!cityName || cityName.length == 0){
    alert('wow, please dont do that');
  }else{
    addACity(cityName);
  }
}

function addACity(cityName){
  makeHttpCall(CITY_WEATHER_URL+cityName+ API_KEY, function(city){
    populateTable(JSON.parse(city));
    WEATHER_DATA.push(JSON.parse(city));
    console.log('updating localStorage');
    console.log(WEATHER_DATA);
    localStorage.setItem('weather', JSON.stringify(WEATHER_DATA));
  });
}
function init() {
  //check for localStorage -> if it exists, populate data in the table from the
  console.log('init module started');
  document.getElementById('cities-list').addEventListener('input', function(event) {
    console.log('changed');
    console.log(event.target.value);
  });
  if (storageAvailable('localStorage')) {
    console.log('local storage is supported');
    if (localStorage.getItem('weather')) {
      console.log('populating table from localStorage');
      populateTableFromLocalStorage();
    } else {
      makeHttpCall(CITY_WEATHER_URL+'Phoenix'+ API_KEY, function(city1) {
        populateTable(JSON.parse(city1));
        WEATHER_DATA.push(JSON.parse(city1));
        makeHttpCall(CITY_WEATHER_URL+'Bangalore'+ API_KEY, function(city2) {
          populateTable(JSON.parse(city2));
          WEATHER_DATA.push(JSON.parse(city2));
          console.log('storing object to local storage');
          console.log(WEATHER_DATA);
          localStorage.setItem('weather', JSON.stringify(WEATHER_DATA));
        });
      });
    }
  } else {
    console.log('local storage is not supported');
  }
}
