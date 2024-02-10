import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { MainService } from './main.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, catchError, delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeResolverService implements Resolve<any> {

  constructor(private mainService: MainService, private router: Router, private toastr: ToastrService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.mainService.getDataForDashboard().subscribe((res: any) => {
    //   let data = res.filter((hotel: any) => hotel.hotel_id === Number(route.params?.['id']));
    //   if (data && data.length) {
    //     return of(data)
    //   } else {
    //     this.router.navigate(['search-hotel']);
    //     this.toastr.error('Error while fetching hotel data', 'Data Not available', {
    //       timeOut: 3000,
    //     });
    //     return EMPTY;
    //   }
    // }, (err) => {
    //   this.toastr.error('Error While getting hotel data', 'Data Not available', {
    //     timeOut: 3000,
    //   });
    // })
    return this.mainService.getDataForDashboard().pipe(
      delay(2000),
      catchError(() => {
        this.router.navigate(['search-hotel']);
        return EMPTY;
      })
    )
  }
}
