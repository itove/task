import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BidsPage } from './bids.page';

const routes: Routes = [
  {
    path: '',
    component: BidsPage
  },
  {
    path: 'offer',
    loadChildren: () => import('./offer/offer.module').then( m => m.OfferPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BidsPageRoutingModule {}
