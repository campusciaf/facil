import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsLoaderService {

  private googleMapsPromise: Promise<void>;

  constructor() {
    this.googleMapsPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD-9GbQKtTGVtTsUJiUfMwFfbsB0hN8UGw&callback=initialize&v=weekly";
      script.onload = () => {
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  load(): Promise<void> {
    return this.googleMapsPromise;
  }


}
