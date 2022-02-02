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
    this.audio = new Audio();
    this.audio.src = "assets/tetris-music.mp3";
    this.audio.load();
    this.audio.loop = true;
    this.audio.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );
    this.audio.play();
  }

  public playPause() {
    this.audio.muted = !this.audio.muted;
    this.cd.detectChanges();
  }
}
