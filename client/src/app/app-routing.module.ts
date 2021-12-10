import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PieceComponent } from './piece/piece.component';
import { deactivateService } from './services/Deactivate.service';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: ':piece/:playerName',
    component: PieceComponent,
    pathMatch: 'full',
    canDeactivate: [deactivateService]
  },
  {
    path: '**',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'ignore'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
