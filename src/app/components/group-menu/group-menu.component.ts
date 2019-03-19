import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material';

// Dialog Components
import { AddMemberComponent } from '../add-member/add-member.component';
import { GroupInfoComponent } from '../group-info/group-info.component';

@Component({
  selector: 'app-group-menu',
  templateUrl: './group-menu.component.html',
  styleUrls: ['./group-menu.component.css']
})
export class GroupMenuComponent implements OnInit {

  currentGroup;
  isGroup = false;
  isOwner = false;

  constructor(private groupsService: GroupsService,
              private authService: AuthService,
              private dialogRef: MatDialog) { }

  ngOnInit() {
    this.groupsService.enteredGroup.subscribe((value) => {
      if (value) {
        this.currentGroup = this.groupsService.currentGroup;
        if (this.currentGroup.creator === this.authService.currentUserDetails().email) {
          this.isOwner = true;
          this.isGroup = true;
        }
      } else {
        this.isGroup = false;
      }
    });
  }

  addMember() {
    this.dialogRef.open(AddMemberComponent, {
      height: '500px',
      width: '400px'
    });
  }

  groupInfo() {
    this.dialogRef.open(GroupInfoComponent, {
      height: '500px',
      width: '400px'
    });
  }

}
