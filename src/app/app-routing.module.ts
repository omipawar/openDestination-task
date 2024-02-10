import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { HomeResolverService } from './services/home-resolver.service';

const routes: Routes = [
  { path: "search-hotel", component: HotelSearchComponent },
  {
    path: "dashboard/:id",
    resolve: {
      user: HomeResolverService
    },
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  { path: "**", redirectTo: "search-hotel" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
