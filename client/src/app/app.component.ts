import { ChangeDetectorRef, Component } from "@angular/core";
import { WebsocketService } from "./services/websocketService";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "red-tetris";
  public audio;

  constructor(
    private socketService: WebsocketService,
    private cd: ChangeDetectorRef
  ) {
    this.socketService.setupSocketConnection();
  }
}
