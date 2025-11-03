import {
  Component,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
  OnInit,
} from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
declare var google;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any;
  geocoder: any;
  addressUser: any;
  showCurrentPosition = false;
  @Input() small: string = '';
  @Input() isWatching: boolean = false;

  @Input() address: any;
  @Input() addressGoogle: any;
  @Input() latitude: any;
  @Input() longitude: any;
  @Input() edit = false;
  @Output() newAddressGoogle = new EventEmitter<string>();
  @Output() newAddress = new EventEmitter<string>();
  @Output() newLatitude = new EventEmitter<number>();
  @Output() newLongitude = new EventEmitter<number>();

  constructor(public zone: NgZone) {}

  ngOnInit() {
    // Load google library
    this.loadGoogleMapsLibrary().then((google: any) => {
      // Define geocoder
      this.geocoder = new google.maps.Geocoder();

      // Initialize map
      this.waitMapElementLoaded().then(() => {
        this.initializeMap();
      });
    });
  }

  loadGoogleMapsLibrary(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (window['google']) {
        return resolve(window['google']);
      }
      let element = document.createElement('script');
      element.id = 'google-maps-api-script';
      element.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAt89XN0--kkTZg9EVBbZ-CinVudsBT4eA&libraries=places';
      element.type = 'text/javascript';
      element.onload = () => {
        resolve(window['google']);
      };
      element.onerror = () => {
        reject();
      };
      document.body.appendChild(element);
    });
  }

  waitMapElementLoaded() {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (this.mapElement) resolve();
      }, 500);
    });
  }

  initializeMap() {
    this.zone.run(() => {
      if (!this.latitude || !this.longitude) {
        this.showCurrentPosition = true;
      }

      var mapEle = this.mapElement.nativeElement;
      this.map = new google.maps.Map(mapEle, {
        zoom: 16,
        // center: { lat: -31.3464616, lng: -64.2812909 },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ color: '#ffffff' }, { lightness: 17 }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }],
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }, { lightness: 18 }],
          },
          {
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [{ color: '#ffffff' }, { lightness: 16 }],
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#dedede' }, { lightness: 21 }],
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [
              { visibility: 'on' },
              { color: '#ffffff' },
              { lightness: 16 },
            ],
          },
          {
            elementType: 'labels.text.fill',
            stylers: [
              { saturation: 36 },
              { color: '#333333' },
              { lightness: 40 },
            ],
          },
          { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#f2f2f2' }, { lightness: 19 }],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.fill',
            stylers: [{ color: '#fefefe' }, { lightness: 20 }],
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }],
          },
        ],
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      });

      if (this.showCurrentPosition) {
        this.setCurrentPosition();
      } else {
        const position = {
          lat: this.latitude,
          lng: this.longitude,
        };
        this.setPosition(position);
      }
    });
  }

  setCurrentPosition() {
    this.getCurrentLocation()
      .then((position) => {
        this.setPosition(position);
        this.findAddress(position);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setPosition(position) {
    if (!position) return;

    // Put marker
    if (this.marker) {
      this.marker.setPosition(
        new google.maps.LatLng(position.lat, position.lng)
      );
    } else {
      this.marker = new google.maps.Marker({
        draggable: this.edit,
        position: position,
        map: this.map,
      });

      if (this.edit) {
        google.maps.event.addListener(this.marker, 'dragend', () => {
          const position = {
            lat: this.marker.position.lat(),
            lng: this.marker.position.lng(),
          };
          this.setPosition(position);
          this.findAddress(position);
        });
      }
    }

    this.setLatitude(position.lat);
    this.setLongitude(position.lng);

    // Center map
    this.map.setCenter(position);
  }

  changeAddress(event) {
    this.setAddress(event.target.value);
  }

  findAddressUser() {
    this.geocoder.geocode(
      { address: this.addressUser },
      (addresses, status) => {
        if (
          status === 'OK' &&
          addresses[0] &&
          addresses[0].geometry &&
          addresses[0].geometry.location
        ) {
          const position = {
            lat: addresses[0].geometry.location.lat(),
            lng: addresses[0].geometry.location.lng(),
          };
          this.setPosition(position);
          this.updateAddress(addresses);
        }
      }
    );
  }

  findAddress(location) {
    this.geocoder.geocode({ location: location }, (addresses, status) => {
      this.updateAddress(addresses);
    });
  }

  updateAddress(addresses) {
    this.zone.run(() => {
      if (addresses && addresses[0]) {
        this.setAddressGoogle(addresses[0].formatted_address);
      } else {
        this.setAddressGoogle(null);
      }
      this.setAddress(this.getAddressGoogle());
    });
  }

  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            resolve(pos);
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject('No hay navigator');
      }
    });
  }

  setAddress(address) {
    this.address = address;
    this.newAddress.emit(address);
  }

  setAddressGoogle(addressGoogle) {
    this.addressGoogle = addressGoogle;
    this.newAddressGoogle.emit(addressGoogle);
  }

  getAddressGoogle() {
    return this.addressGoogle;
  }

  setLatitude(latitude) {
    this.latitude = latitude;
    this.newLatitude.emit(latitude);
  }

  setLongitude(longitude) {
    this.longitude = longitude;
    this.newLongitude.emit(longitude);
  }
}
