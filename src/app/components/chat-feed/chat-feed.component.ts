import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit {

  constructor(private messagesService: MessagesService) { }

  showChat: boolean;

  ngOnInit() {
    this.messagesService.enteredChat.subscribe((value) => {
      this.showChat = value;
    });
  }

}
