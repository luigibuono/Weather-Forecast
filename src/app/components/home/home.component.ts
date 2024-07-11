import { Component, ElementRef, HostListener } from '@angular/core';
import { WeatherService } from 'src/app/services/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  city = '';
  weather: any;
  hourlyData: any[][] = [];
  startDate: Date = new Date();
  cityNotFoundError: boolean = false;

  // Proprietà per gestire i suggerimenti di ricerca
  showSuggestions: boolean = false;
  citySuggestions: string[] = [];

  constructor(private weatherService: WeatherService, private el: ElementRef) { }

  searchWeather(): void {
    if (this.isValidCityName(this.city)) {
      this.cityNotFoundError = false;

      this.weatherService.getCoordinates(this.city).subscribe(
        (data) => {
          if (data.results && data.results.length > 0) {
            const lat = data.results[0].geometry.lat;
            const lon = data.results[0].geometry.lng;

            const today = new Date();
            const startDate = today.toISOString().slice(0, 10); // Oggi in formato yyyy-mm-dd
            const endDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10); // 7 giorni da oggi

            this.weatherService.getWeather(lat, lon, startDate, endDate).subscribe(
              (weatherData) => {
                this.weather = weatherData;

                if (this.weather?.hourly?.temperature_2m) {
                  this.hourlyData = this.chunkArray(this.weather.hourly.temperature_2m, 24);
                }
              },
              (error) => {
                console.error('Errore nel recupero dei dati meteo:', error);
                this.cityNotFoundError = true;
                this.resetWeatherData();
              }
            );
          } else {
            this.cityNotFoundError = true;
            this.resetWeatherData();
          }
        },
        (error) => {
          console.error('Errore nel recupero delle coordinate:', error);
          this.cityNotFoundError = true;
          this.resetWeatherData();
        }
      );
    } else {
      this.cityNotFoundError = true;
      this.resetWeatherData();
    }
  }

  resetWeatherData(): void {
    this.weather = null;
    this.hourlyData = [];
  }

  chunkArray(arr: any[], chunkSize: number): any[][] {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunkedArray.push(arr.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }

  formatHour(hourIndex: number): string {
    return `${hourIndex}:00`;
  }

  getDayDate(dayIndex: number): string {
    const date = new Date(this.startDate);
    date.setDate(this.startDate.getDate() + dayIndex);
    return date.toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  isValidCityName(city: string): boolean {
 /*
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(city);
  */
 return true;
  }
  
  ngOnInit(): void {
    // Inizializza il monitoraggio dell'input della città per i suggerimenti
    this.weatherService.getCitySuggestions(this.city)
      .subscribe((suggestions: string[]) => {
        this.citySuggestions = suggestions;
      });
  }

  onCityInput(): void {
    // Monitora l'input della città per ottenere i suggerimenti
    if (this.isValidCityName(this.city)) {
      this.weatherService.getCitySuggestions(this.city)
        .subscribe((suggestions: string[]) => {
          this.citySuggestions = suggestions;
          this.showSuggestions = true; // Mostra i suggerimenti
        }, (error: any) => {
          console.error('Error fetching city suggestions:', error);
          this.citySuggestions = [];
        });
    } else {
      this.citySuggestions = [];
      this.showSuggestions = false; // Nasconde i suggerimenti se l'input non è valido
    }
  }

  selectCity(city: string): void {
    // Seleziona una città dalla lista dei suggerimenti
    this.city = city;
    this.showSuggestions = false; // Nasconde i suggerimenti dopo la selezione
  }

  
  }
  

