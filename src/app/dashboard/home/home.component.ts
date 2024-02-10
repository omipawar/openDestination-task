import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { address, info } from 'src/app/models/models';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild('mySidebar') myDiv!: ElementRef;
  @ViewChild('myOverlay') mioverlay!: ElementRef;
  address: address = {
    address: '',
    email: '',
    mobile: 0
  }
  basicInfo: info = {
    shortName: '',
    serviceId: '',
    serviceType: '',
    defaultCurrency: '',
    location: ''
  }
  addressForm!: FormGroup;
  infoForm!: FormGroup;
  isEditAddress: boolean = false;
  isEditInfo: boolean = false;
  subscriptions: Subscription[] = [];
  hotelInfo: any;

  constructor(private activatedRoute: ActivatedRoute, private mainService: MainService, private router: Router, private toastr: ToastrService) {

  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }

  ngOnInit(): void {
    let id = this.activatedRoute.snapshot.paramMap.get('id');
    this.subscriptions.push(this.activatedRoute.data.subscribe((res: any) => {
      console.log('-----', res);
      if (res.user[0].hotel_id !== Number(id)) {
        this.router.navigate(['search-hotels'])
        this.toastr.warning('User Not found!');
      }
      this.hotelInfo = res.user[0];
    }));
    this.createAddressForm();
    this.createInfoForm();
    this.getHotelInfo(id);

  }

  getHotelInfo(id: string | null) {
    this.mainService.addressDetails.subscribe((res: address) => {
      this.address = res;
      this.addressForm.patchValue(this.address)
      console.log('--->>>', res);
    })
    this.mainService.basinInfo.subscribe((res: info) => {
      this.basicInfo = res;
      this.infoForm.patchValue(this.basicInfo)
      console.log('--->>>', res);
    })
  }

  w3_open() {
    this.myDiv.nativeElement.style.display = 'block';
    this.mioverlay.nativeElement.style.display = 'block';
  }
  w3_close() {
    this.myDiv.nativeElement.style.display = 'none';
    this.mioverlay.nativeElement.style.display = 'none';
  }

  openAccordion(e: any) {
    let panel = e.target.nextElementSibling;
    if (panel.style.display === 'block' || panel.style.display === '') {
      panel.style.display = 'none'
    } else if (panel.style.display === 'none') {
      panel.style.display = 'block'
    }
  }

  createAddressForm() {
    this.addressForm = new FormGroup({
      address: new FormControl(''),
      email: new FormControl(''),
      mobile: new FormControl('')
    })
  }
  createInfoForm() {
    this.infoForm = new FormGroup({
      shortName: new FormControl(''),
      serviceId: new FormControl(''),
      serviceType: new FormControl(''),
      defaultCurrency: new FormControl(''),
      location: new FormControl('')
    })
  }
  editAddress() {
    if (this.isEditAddress) {
      console.log(this.addressForm.value);
      this.mainService.addressDetails.next(this.addressForm.value);
      this.toastr.success("Address updated successfuly!")
    }
    this.isEditAddress = !this.isEditAddress;
  }
  onEditInfo() {
    if (this.isEditInfo) {
      console.log(this.infoForm.value);
      this.mainService.basinInfo.next(this.infoForm.value);
      this.toastr.success("Basic information updated successfuly!")

    }
    this.isEditInfo = !this.isEditInfo
  }
}
