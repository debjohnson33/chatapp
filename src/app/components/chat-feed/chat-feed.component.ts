import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-chat-feed',
  templateUrl: './chat-feed.component.html',
  styleUrls: ['./chat-feed.component.css']
})
export class ChatFeedComponent implements OnInit {

  constructor(private messagesService: MessagesService,
              private authService: AuthService) { }

  showChat: boolean;
  messages = [];
  loadingSpinner = false;
  MyId;
  MyAvatar;
  currentChatUser;

  ngOnInit() {
    this.messagesService.enteredChat.subscribe((value) => {
      this.showChat = value;
      this.getMessages();
      this.currentChatUser = this.messagesService.currentChatUser;
    });
    this.MyAvatar = this.authService.currentUserDetails().photoURL;
  }

  getMessages() {
    this.loadingSpinner = true;
    this.messagesService.getAllMessages().then((messageObs: any) => {
      if (!messageObs) {
        console.log('Nothing to Show');
      } else {
        messageObs.subscribe((messages) => {
          this.loadingSpinner = false;
          this.messages = messages;
        });
      }
    });
  }

  // Choose bubble style
  chooseClass(msg) {
    this.MyId = this.authService.currentUserDetails().email;
  }
}
