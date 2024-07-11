import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey: string = 'fe27844bf4f7430b99487cba506eceef'; // Free key from OpenCage
  private url: string = 'https://api.opencagedata.com/geocode/v1/json'; // OpenCage URL
  private baseUrl: string = 'https://api.open-meteo.com/v1/forecast'; // Open-Meteo URL

  constructor(private http: HttpClient) { }

  getWeather(lat: number, lon: number, startDate: string, endDate: string): Observable<any> {
    let params = new HttpParams()
      .set('latitude', lat.toString())
      .set('longitude', lon.toString())
      .set('hourly', 'temperature_2m,precipitation,wind_speed_10m,wind_direction_10m')
      .set('start_date', startDate)
      .set('end_date', endDate);

    const requestUrl = `${this.baseUrl}`;
    return this.http.get<any>(requestUrl, { params });
  }

  getCoordinates(city: string): Observable<any> {
    const requestUrl = `${this.url}?q=${encodeURIComponent(city)}&key=${this.apiKey}`;
    return this.http.get<any>(requestUrl);
  }

  getCitySuggestions(query: string): Observable<string[]> {
    const requestUrl = `${this.url}?q=${encodeURIComponent(query)}&key=${this.apiKey}`;
    return this.http.get<any>(requestUrl).pipe(
      map((data: any) => {
        if (data.results && data.results.length > 0) {
          return data.results.map((result: any) => result.formatted);
        } else {
          return [];
        }
      })
    );
  }
  


}
