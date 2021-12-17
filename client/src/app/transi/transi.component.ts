import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-transi",
  template: ` <p>sdqffffffffffffffffff</p>`,
  styleUrls: ["./transi.component.css"],
})
export class TransiComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    console.log("test");
    const url = this.router.url;
    let paramRoomId = url.split("#")[1].split("[")[0];
    let paramPlayerName = url.split("[")[1].split("]")[0];
    console.log(paramRoomId, paramPlayerName);
  }
}
