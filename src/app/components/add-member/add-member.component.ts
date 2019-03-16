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
  isMember = [];

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

  addFriend(user) {
    this.groupsService.addMember(user);
  }

  updateList() {
    this.groupsService.getMembers().then((memberList: any) => {
      let flag = 0;
      this.isMember = [];
      this.myFriends.forEach((member, i) => {
        memberList.forEach((element) => {
          if (member.email === element.email) {
            flag += 1;
          }
        });
        if (flag === 1) {
          this.isMember.push(false);
          flag = 0;
        } else {
          this.isMember.push(true);
        }
      });
    });
  }
}
