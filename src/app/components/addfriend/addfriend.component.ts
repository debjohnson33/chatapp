import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RequestsService } from '../../services/requests.service';
import { MatSnackBar } from '@angular/material';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.css']
})
export class AddfriendComponent implements OnInit {

  users;
  isFriends = [];
  isRequested = [];
  isSent = [];

  constructor(private userService: UserService,
              private requestService: RequestsService,
              private friendService: FriendsService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users) => {

      // Friends filter
      this.friendService.getMyFriends().then((res: any) => {
        res.subscribe((user) => {
          if (user === 'Exists') {
            this.friendService.getFriendList().subscribe((friends: any) => {
              if (friends) {
                this.isFriends = [];
                let flag = 0;
                users.map((userElement, i) => {
                  friends.forEach((friendElement) => {
                    if (userElement.email === friendElement.email) {
                      flag += 1;
                    }
                  });
                  if (flag === 1) {
                    this.isFriends[i] = true;
                    flag = 0;
                  } else {
                    this.isFriends[i] = false;
                    flag = 0;
                  }
                });
              } else {
                users.map((userElement, i) => {
                  this.isFriends[i] = false;
                });
              }
            });
          }
        });
      });
      // Filter out the previously requested users
      this.requestService.getMyRequests().subscribe((requests: any) => {
        let flag = 0;
        this.isRequested = [];
        users.forEach((userElement, i) => {
          requests.forEach((requestElement) => {
            if (userElement.email === requestElement.sender) {
              flag += 1;
            }
          });
          if (flag === i) {
            this.isRequested[i] = true;
          } else {
            this.isRequested[i] = false;
            flag = 0;
          }
        });
      });
      // Filter out the users who sent requests to you
      this.requestService.getSentRequests().subscribe((requests: any) => {
        let flag = 0;
        // this.mySentRequests = requests;
        this.isSent = [];
        users.forEach((userElement, i) => {
          requests.forEach((requestElement) => {
            if (userElement.email === requestElement.reciever) {
              flag += 1;
            }
          });
          if (flag === 1) {
            this.isSent[i] = true;
            flag = 0;
          } else {
            this.isSent[i] = false;
            flag = 0;
          }
        });
      });

      this.users = users;
    });
  }

  addFriend(user) {
    this.requestService.addRequest(user.email).then(() => {
      this.snackBar.open('Request Sent', 'Okay', {duration: 3000});
    });
  }

  canShow(index) {
    if (this.isFriends[index]) {
      return false;
    } else if (this.isRequested[index]) {
      return false;
    } else if (this.isSent[index]) {
      return false;
    } else {
      return true;
    }
  }

}
