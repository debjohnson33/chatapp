import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { UserService } from '../../services/user.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  myNotifications = [];
  currentChatUser;
  showNotifications = false;

  constructor(private messagesService: MessagesService,
              private friendsService: FriendsService) { }

  ngOnInit() {
    this.messagesService.enteredChat.subscribe((value) => {
      if (value) {
        this.currentChatUser = this.messagesService.currentChatUser;
        this.messagesService.clearNotifications();
      }
    });
    this.messagesService.getMyNotifications().subscribe((notifications) => {
      this.showNotifications = false;
      if (this.currentChatUser !== undefined) {
        notifications.forEach((element: any, i) => {
          if (element.sender === this.currentChatUser.email) {
            notifications.splice(i, 1);
            this.messagesService.clearNotifications();
          }
        });
      }
      this.myNotifications = notifications;
      this.showNotifications = true;
    });
  }

}
