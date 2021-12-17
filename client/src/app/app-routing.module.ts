import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { hashKey } from "./customUrlSerializer";
import { HomeComponent } from "./home/home.component";
import { PieceComponent } from "./piece/piece.component";
import { TransiComponent } from "./transi/transi.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    pathMatch: "full",
  },
  {
    path: ":piece[:playerName]/piece",
    component: PieceComponent,
    pathMatch: "full",
  },
  {
    path: `:piece[:playerName]`,
    component: TransiComponent,
    pathMatch: "full",
  },
  {
    path: "**",
    component: HomeComponent,
    pathMatch: "full",
  },
  {
    path: "",
    component: HomeComponent,
    pathMatch: "full",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: "ignore",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
