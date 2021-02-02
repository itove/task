import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopicPage } from './topic.page';

const routes: Routes = [
  {
    path: '',
    component: TopicPage
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
export class TopicPageRoutingModule {}