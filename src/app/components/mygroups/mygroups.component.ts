import { Component, OnInit } from '@angular/core';
import { GroupsService } from '../../services/groups.service';
import { MessagesService } from '../../services/messages.service';

import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mygroups',
  templateUrl: './mygroups.component.html',
  styleUrls: ['./mygroups.component.css']
})
export class MygroupsComponent implements OnInit {

  groupName: string;
  showAdd = false;
  myGroups = [];

  constructor(private groupsService: GroupsService,
              private toast: MatSnackBar,
              private messagesService: MessagesService) { }

  ngOnInit() {
    this.groupsService.getGroups().then((groupObs: any) => {
      groupObs.subscribe((groups) => {
        this.myGroups = groups;
      });
    });
  }

  addGroup() {
    this.showAdd = this.showAdd;
  }

  createGroup() {
    this.groupsService.createGroup(this.groupName).then(() => {
      this.toast.open('Group Created', 'Dismiss', {
        duration: 3000
      });
      this.groupName = '';
    });
  }

  openGroup(group) {
    this.groupsService.enterGroup(group);
    this.messagesService.enterChat('closed');
  }

}
