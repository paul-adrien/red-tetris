import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-pop-up-game",
  template: ` <img [src]="this.randomGif()" /> `,
  styleUrls: ["./pop-up-game.component.scss"],
})
export class PopUpGameComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  public isWin = undefined;
  public number = Math.floor(Math.random() * 5) + 1;

  ngOnInit() {
    this.isWin = this.data.isWin;
  }

  randomGif() {
    if (this.isWin) {
      return "./assets/win" + this.number + ".gif";
    } else {
      return "./assets/lose" + this.number + ".gif";
    }
  }
}
