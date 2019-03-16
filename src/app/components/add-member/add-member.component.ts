import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { UserService } from '../../services/user.service';
import { FriendsService } from '../../services/friends.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})

export class AddMemberComponent implements OnInit {

  loadingSpinner = false;
  myFriends = [];

  constructor(private friendsService: FriendsService,
              private groupsService: GroupsService,
              private userService: UserService) { }

  ngOnInit() {
    this.friendsService.getMyFriends().then((value: any) => {
      this.loadingSpinner = true;
      value.subscribe((friendsemail) => {
        if (friendsemail === 'Exists') {
          this.friendsService.getFriendList().subscribe((friends) => {
            this.userService.getUserDetails(friends).then((friendDetails: any) => {
              this.myFriends = friendDetails;
            });
          });
        }
      });
    });
  }

}
