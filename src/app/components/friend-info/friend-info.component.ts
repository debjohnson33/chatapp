import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-friend-info',
  templateUrl: './friend-info.component.html',
  styleUrls: ['./friend-info.component.css']
})
export class FriendInfoComponent implements OnInit {

  currentUser;
  isUserSelected = false;

  constructor(private messagesService: MessagesService) { }

  ngOnInit() {
    this.messagesService.enteredChat.subscribe((value) => {
      if (value) {
        this.currentUser = this.messagesService.currentChatUser;
        this.isUserSelected = true;
      } else {
        this.isUserSelected = false;
      }
    });
  }

  audioCall() {

  }

  closeChat() {
    this.messagesService.enterChat('closed');
  }

}
