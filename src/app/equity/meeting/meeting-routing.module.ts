import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeetingPage } from './meeting.page';

const routes: Routes = [
  {
    path: '',
    component: MeetingPage
  },
  {
    path: 'node',
    loadChildren: () => import('./node/node.module').then( m => m.NodePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeetingPageRoutingModule {}