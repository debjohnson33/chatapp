import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../../services/friends.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-myfriends',
  templateUrl: './myfriends.component.html',
  styleUrls: ['./myfriends.component.css']
})
export class MyfriendsComponent implements OnInit {

  constructor(private friendService: FriendsService, private userService: UserService) { }

  users;

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.friendService.getMyFriends().then((friends: any) => {
      friends.subscribe((isThere: any) => {
        if (isThere === 'Exists') {
          this.friendService.getFriendList().subscribe((mates) => {
            this.users = this.userService.getUserDetails(mates);
          });
        }
      });
    });
  }

}
