import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { RequestsService } from '../../services/requests.service';
import { MatSnackBar } from '@angular/material';
import { FriendsService } from '../../services/friends.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.css']
})
export class AddfriendComponent implements OnInit {

  users;
  bkupUsers;
  startAt = new Subject();
  endAt = new Subject();
  isFriends = [];
  isRequested = [];
  isSent = [];

  // For instant search
  myFriends = [];
  myRequests = [];
  mySentRequests = [];

  constructor(private userService: UserService,
              private requestService: RequestsService,
              private friendService: FriendsService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.userService.getAllUsers().subscribe((users: any) => {
      this.bkupUsers = users;
      // Friends filter
      this.friendService.getMyFriends().then((res: any) => {
        res.subscribe((user) => {
          if (user === 'Exists') {
            this.friendService.getFriendList().subscribe((friends: any) => {
              this.myFriends = friends;
              if (friends) {
                this.isFriends = [];
                let flag = 0;
                users.pipe(map((userElement: any, i) => {
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
                }));
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
        this.myRequests = requests;
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
        this.mySentRequests = requests;
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

  instantSearchFilter(users) {
    if (this.myFriends) {
      this.isFriends = [];
      this.isRequested = [];
      this.isSent = [];
      let flag = 0;
      let flag2 = 0;
      let flag3 = 0;

      users.map((userElement, i) => {
        this.myFriends.forEach((friendElement) => {
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
        this.myRequests.forEach((requestElement) => {
                if (userElement.email === requestElement.sender) {
                  flag2 += 1;
                  }
                });
        if (flag2 === 1) {
                    this.isRequested[i] = true;
                    flag2 = 0;
                  } else {
                    this.isRequested[i] = false;
                    flag2 = 0;
                  }
        this.mySentRequests.forEach((requestElement) => {
            if (userElement.email === requestElement.reciever) {
              flag3 += 1;
            }
          });
        if (flag3 === 1) {
              this.isSent[i] = true;
              flag3 = 0;
            } else {
              this.isSent[i] = false;
              flag3 = 0;
            }
      });
    } else {
        users.map((element, i) => {
          this.isFriends[i] = false;
        });
      }
  }


  addFriend(user) {
    this.requestService.addRequest(user.email).then(() => {
      this.snackBar.open('Request Sent', 'Okay', {duration: 3000});
    });
  }

  // Instant Searching
  instantSearch($event) {
    const q = $event.target.value;
    if (q !== '') {
      this.startAt.next(q);
      this.endAt.next(q + '\uf8ff');
      Observable.combineLatest(this.startAt, this.endAt).take(1).subscribe((value) => {
        this.userService.instantSearch(value[0], value[1]).take(1).subscribe((users) => {
          this.instantSearchFilter(users);
          this.users = users;
        });
      });
    } else {
      this.instantSearchFilter(this.bkupUsers);
      this.users = this.bkupUsers;
    }
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
