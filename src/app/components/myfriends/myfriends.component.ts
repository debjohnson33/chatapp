import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { UserService } from '../../services/user.service';
import { MessagesService } from '../../services/messages.service';

@Component({
  selector: 'app-myfriends',
  templateUrl: './myfriends.component.html',
  styleUrls: ['./myfriends.component.css']
})
export class MyfriendsComponent implements OnInit {

  constructor(private friendService: FriendsService,
              private userService: UserService,
              private messagesService: MessagesService) { }

  users;
  statuses = [];

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.friendService.getMyFriends().then((friends: any) => {
      friends.subscribe((isThere: any) => {
        if (isThere === 'Exists') {
          this.friendService.getFriendList().subscribe((mates) => {
            this.userService.getUserStatus(friends).then((status: any) => {
              this.statuses = status;
            });
            this.userService.getUserDetails(mates).then((mateDetails) => {
              this.users = mateDetails;
              this.userService.updateStatuses();
            });
          });
        }
      });
    });
    this.userService.statusUpdate.subscribe((value) => {
      if (value === 'StatusUpdated') {
        if (this.users) {
          this.userService.getUserStatus(this.users).then((status: any) => {
            this.statuses = status;
          });
        }
      }
    });
  }

  // Chat with a particular user
  enterChat(user) {
    this.messagesService.enterChat(user);
  }

}
