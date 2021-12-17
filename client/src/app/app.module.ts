import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { WebsocketService } from "./services/websocketService";
import { PieceComponent } from "./piece/piece.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HeaderComponent } from "./header/header.component";
import { TransiComponent } from "./transi/transi.component";
import { UrlSerializer } from "@angular/router";
import { CustomUrlSerializer } from "./customUrlSerializer";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PieceComponent,
    HeaderComponent,
    TransiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
  providers: [
    WebsocketService,
    { provide: UrlSerializer, useClass: CustomUrlSerializer },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
