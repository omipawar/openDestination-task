import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { latLng, tileLayer } from 'leaflet';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  hotelInfo: any;
  subscriptions: Subscription[] = [];

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
  };
  public barChartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  public barChartType = 'bar';
  public barChartLegend = false;
  public barChartData = [
    {
      data: [],
      backgroundColor: 'grey', hoverBackgroundColor: 'black', borderColor: '#ccc'
    },
  ];
  latitude = 28.7041;
  longitude = 77.1025;
  options:any;

  constructor(private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.activatedRoute.data.subscribe((res: any) => {
        this.hotelInfo = res.user[0];
      })
    )
    this.barChartData[0].data = this.hotelInfo.data;
    this.latitude = this.hotelInfo.latitude;
    this.longitude = this.hotelInfo.longitude;
    this.options = {
      layers: [
        tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
      ],
      zoom: 5,
      center: latLng(this.latitude, this.longitude)
    }
    this.initMap();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe()
    })
  }

  private initMap(): void {
    const mymap = L.map('map').setView([this.latitude, this.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mymap);

    L.marker([this.latitude, this.longitude]).addTo(mymap)
      // .bindPopup('Your Location')
      // .openPopup();
  }

}
