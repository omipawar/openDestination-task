import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable } from 'rxjs';
import { address, info } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  url: string = "../../assets/data/hotels.json";
  dashboardUrl:string='../../assets/data/home.json'
  addressDetails = new BehaviorSubject<address>({
    address:'36, WoodLand Rise, Muswell Hill, London, N10 3UG, United Kingdom.',
    email:'adam@opendestination.com',
    mobile: 2122342482
  })
  basinInfo = new BehaviorSubject<info>({
    shortName:'ODLIG',
    serviceId:'123',
    serviceType:'Accomodation',
    defaultCurrency:'US Dollar',
    location:'London'
  })

  constructor(private http: HttpClient, private toastr:ToastrService) { }

  getHotelsList(): Observable<any> {
    return this.http.get(this.url)
  }

  getDataForDashboard(){
    return this.http.get(this.dashboardUrl)
  }
}
