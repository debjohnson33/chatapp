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
  messages = [];

  ngOnInit() {
    this.messagesService.enteredChat.subscribe((value) => {
      this.showChat = value;
      this.getMessages();
    });
  }

  getMessages() {
    this.messagesService.getAllMessages().then((messageObs: any) => {
      if (!messageObs) {
        console.log('Nothing to Show');
      } else {
        messageObs.subscribe((messages) => {
          this.messages = messages;
        });
      }
    });
  }
}
