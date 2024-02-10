import { Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hotel-search',
  templateUrl: './hotel-search.component.html',
  styleUrls: ['./hotel-search.component.css']
})
export class HotelSearchComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  allHotels: any;
  hotels: any[] = [];
  page: number = 1;
  searchSubject = new Subject<string>();
  isFilter: boolean = false;
  fileteredData = []

  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    this.checkIfScrolledToBottom(event.target);
  }

  constructor(private mainService: MainService,
    private elementRef: ElementRef,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((searchResults) => {
        if (searchResults === '') {
          this.hotels = [];
          this.isFilter = false;
          this.fileteredData = [];
        } else if (searchResults) {
          this.isFilter = true;
          this.hotels = []
        }
        this.getFilteredRecords(searchResults);
      });
    this.getHotelDetails();
  }

  getHotelDetails() {
    this.subscriptions.push(this.mainService.getHotelsList().subscribe((res: any) => {
      this.allHotels = res
      console.log(res[48]);
      // this.pushNextRecord();
    })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();

    });
  }

  checkIfScrolledToBottom(element: any) {
    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
      this.page++;
      console.log('Scrolled to the bottom!');
      this.pushNextRecord();
    } else {
      // console.log('Not at the bottom yet!');

    }
  }
  notifi() {
    this.toastr.success('Hello world!', 'Toastr fun!');
    this.toastr.error('everything is broken', 'Major Error', {
      timeOut: 3000,
    });
  }

  onSearchInputChange(searchTerm: any) {
    let value = searchTerm.target.value
    this.searchSubject.next(value);
  }

  getFilteredRecords(searchText: string) {
    if(searchText) this.fileteredData = this.allHotels.filter((hotel: any) => hotel.hotel_name.toLowerCase().includes(searchText));
    console.log("filtered records no---->>", this.fileteredData.length);
    this.pushNextRecord();

  }

  pushNextRecord() {
    if (this.isFilter) {
      let counts = this.fileteredData.length;
      let from = this.hotels.length;
      let to = from + 10;
      if (from <= counts) {
        for (let i = 0; i < this.fileteredData.length; i++) {
          if (i >= from && i < to) {
            this.hotels.push(this.fileteredData[i])
          }
        }
      }
    } 
    // else {
    //   let counts = this.allHotels.length;
    //   let from = this.hotels.length;
    //   let to = from + 10;
    //   if (from <= counts) {
    //     for (let i = 0; i < this.allHotels.length; i++) {
    //       if (i >= from && i < to) {
    //         this.hotels.push(this.allHotels[i])
    //       }
    //     }
    //   }
    // }
    console.log("after added records---->>>>", this.hotels.length);

  }

}
