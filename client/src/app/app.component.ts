import { Component } from '@angular/core';
import { WebsocketService } from './services/websocketService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'red-tetris';

  constructor(private socketService: WebsocketService) {
    this.socketService.setupSocketConnection();
  }
}
